"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (showOtp) {
      // Verify OTP flow
      try {
        const res = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });

        if (res.ok) {
          // Verification successful, now login
          const loginRes = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if (loginRes?.error) {
            setError(loginRes.error);
          } else {
            router.push('/');
            router.refresh();
          }
        } else {
          const data = await res.json();
          setError(data.message || 'Verification failed');
        }
      } catch (err) {
        setError('An error occurred during verification');
      }
    } else if (isLogin) {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      // Register flow
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, dob, gender }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.needsVerification) {
            setShowOtp(true);
            setSuccess('Registration successful! Please check your email for the verification code.');
          } else {
            // Auto-login (fallback if verification was off)
            await signIn('credentials', {
              redirect: false,
              email,
              password,
            });
            router.push('/');
            router.refresh();
          }
        } else {
          const data = await res.json();
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('An error occurred during registration');
      }
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#022c22]">
      
      <div className="flex-1 flex items-center justify-center w-full px-4 pt-32 pb-12">
        <div className="w-full max-w-md glass-dark p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-3xl font-bold font-poppins text-emerald-400 mb-6 text-center">
            {showOtp ? 'Verify Your Email' : isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {success && showOtp && (
            <div className="mb-6 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm text-center">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {showOtp ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">6-Digit Verification Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all tracking-widest text-center text-2xl"
                  placeholder="------"
                  maxLength={6}
                  required
                />
              </div>
            ) : (
              <>
                {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  placeholder="Eco Warrior"
                  required={!isLogin}
                />
              </div>
            )}

            {!isLogin && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    id="dob" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    required={!isLogin}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    required={!isLogin}
                  >
                    <option value="" disabled className="text-gray-900">Select Gender</option>
                    <option value="Male" className="text-gray-900">Male</option>
                    <option value="Female" className="text-gray-900">Female</option>
                    <option value="Other" className="text-gray-900">Other</option>
                    <option value="Prefer not to say" className="text-gray-900">Prefer not to say</option>
                  </select>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            {isLogin && !showOtp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 bg-white/5 border-white/10 rounded text-emerald-500 focus:ring-emerald-500" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</Link>
                </div>
              </div>
            )}
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold hover:from-emerald-400 hover:to-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                showOtp ? 'Verify & Sign In' : isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {!showOtp && (
            <p className="mt-8 text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
