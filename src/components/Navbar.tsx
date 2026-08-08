"use client";

import { useState, useEffect } from 'react';
import { Leaf, Menu, X, Globe, Trophy, UserCircle, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { ecoScore, xp, reset, updateStats } = useStore();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      const syncUserData = async () => {
        try {
          const currentLocalXp = useStore.getState().xp;
          const res = await fetch(`/api/user/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: session?.user?.email,
              localScore: currentLocalXp 
            }),
            cache: 'no-store'
          });
          if (res.ok) {
            const data = await res.json();
            
            // Only overwrite local stats if the database has equal or more points
            // This prevents a lagging database from wiping out local progress
            if (data.score >= currentLocalXp) {
              updateStats({
                xp: data.score,
                ecoScore: Math.floor(data.score / 100),
                completedChallenges: data.completedChallenges,
                unlockedAreas: data.unlockedAreas,
                carbonSaved: data.carbonSaved || 0,
                treesSaved: data.treesSaved || 0,
                waterSaved: data.waterSaved || 0,
                plasticReduced: data.plasticReduced || 0,
              });
            }
          }
        } catch (error) {
          console.error('Failed to sync user data');
        }
      };
      syncUserData();
    }
  }, [session?.user, updateStats]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-dark py-4' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Leaf className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            </motion.div>
            <span className="text-2xl font-poppins font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              EcoLife
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <NavLink href="/#dashboard">Dashboard</NavLink>
            <NavLink href="/#map">Eco Map</NavLink>
            <NavLink href="/#challenges">Challenges</NavLink>
            <NavLink href="/#calculator">Calculator</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
          </div>
            
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
              <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {mounted ? ecoScore : 0} <span className="text-emerald-400">Pts</span>
              </span>
              <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10 hidden sm:inline-block">
                {mounted ? xp : 0} <span className="text-teal-400">EP</span>
              </span>
            </div>

            {session ? (
              <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-lg">
                <button onClick={() => setShowProfile(!showProfile)} className="p-1.5 rounded-full hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-colors" title="My Profile">
                  <UserCircle className="w-5 h-5" />
                </button>
                {showProfile && (
                  <div className="absolute top-12 right-0 bg-gray-900 border border-emerald-500/30 p-3 rounded-lg shadow-xl text-white whitespace-nowrap z-50 min-w-[150px]">
                    <p className="text-xs font-medium text-emerald-400 mb-1">Display Name</p>
                    <p className="text-sm font-bold truncate">{session.user?.name || 'User'}</p>
                  </div>
                )}
                <div className="w-px h-4 bg-white/20"></div>
                <button onClick={() => { reset(); signOut(); }} className="p-1.5 rounded-full hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-emerald-400 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-dark border-t border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/#dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
            <MobileNavLink href="/#map" onClick={() => setIsOpen(false)}>Eco Map</MobileNavLink>
            <MobileNavLink href="/#challenges" onClick={() => setIsOpen(false)}>Challenges</MobileNavLink>
            <MobileNavLink href="/#calculator" onClick={() => setIsOpen(false)}>Calculator</MobileNavLink>
            <MobileNavLink href="/leaderboard" onClick={() => setIsOpen(false)}>Leaderboard</MobileNavLink>
            
            {session ? (
              <div className="flex items-center gap-4 mt-2 px-3">
                <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium">
                  <UserCircle className="w-5 h-5" /> Profile
                </Link>
                <button onClick={() => { reset(); signOut(); setIsOpen(false); }} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <MobileNavLink href="/login" onClick={() => setIsOpen(false)}>Login</MobileNavLink>
            )}
            <div className="flex items-center gap-6 p-4 mt-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-white">{ecoScore} Score</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-white">{xp} EP</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-gray-300 hover:text-white hover:text-emerald-300 transition-all font-medium text-sm tracking-wide relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}
