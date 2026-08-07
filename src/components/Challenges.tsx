"use client";

import { useStore } from '@/store/useStore';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, TreeDeciduous, LightbulbOff, Trash2, Droplet, Recycle, CheckCircle, Lock, Upload, X } from 'lucide-react';
import { useState } from 'react';

const CHALLENGES_DATA = [
  { id: 'bike', title: 'Ride a Bicycle', xp: 20, icon: <Bike className="w-8 h-8" />, desc: 'Use a bicycle for your daily commute instead of a car.', reqRank: 0, question: 'How many kilometers did you ride today?' },
  { id: 'tree', title: 'Plant a Tree', xp: 50, icon: <TreeDeciduous className="w-8 h-8" />, desc: 'Plant a tree in your local community or garden.', reqRank: 0, question: 'What type of tree did you plant?' },
  { id: 'light', title: 'Save Electricity', xp: 15, icon: <LightbulbOff className="w-8 h-8" />, desc: 'Turn off all unnecessary lights for 24 hours.', reqRank: 0, question: 'Which appliances did you unplug?' },
  { id: 'plastic', title: 'Avoid Plastic', xp: 30, icon: <Trash2 className="w-8 h-8" />, desc: 'Go completely single-use plastic free for 3 days.', reqRank: 100, question: 'What alternatives to plastic did you use?' },
  { id: 'water', title: 'Save Water', xp: 25, icon: <Droplet className="w-8 h-8" />, desc: 'Limit your showers to 5 minutes for a week.', reqRank: 100, question: 'How many liters of water do you estimate you saved?' },
  { id: 'recycle', title: 'Recycle Waste', xp: 35, icon: <Recycle className="w-8 h-8" />, desc: 'Properly segregate and recycle all household waste.', reqRank: 200, question: 'What materials did you segregate today?' },
];

export function Challenges() {
  const { data: session } = useSession();
  const { xp, completedChallenges, completeChallenge } = useStore();
  const [showConfetti, setShowConfetti] = useState<string | null>(null);
  
  // Verification Modal State
  const [activeChallenge, setActiveChallenge] = useState<typeof CHALLENGES_DATA[0] | null>(null);
  const [answer, setAnswer] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  
  // AI Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge || !video) return;
    
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('challengeTitle', activeChallenge.title);
      formData.append('challengeId', activeChallenge.id);
      if (session?.user?.email) {
        formData.append('email', session.user.email);
      }
      formData.append('xp', activeChallenge.xp.toString());

      const res = await fetch('/api/verify-challenge', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.isApproved) {
        completeChallenge(activeChallenge.id, activeChallenge.xp);
        setShowConfetti(activeChallenge.id);
        setTimeout(() => setShowConfetti(null), 2000);
        setActiveChallenge(null);
        setAnswer('');
        setVideo(null);
      } else {
        setVerificationError(data.reason || data.message || 'Verification failed. Please try a different video.');
      }
    } catch (error) {
      setVerificationError('An error occurred while connecting to the AI. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHALLENGES_DATA.map((challenge, index) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          const isLocked = xp < challenge.reqRank;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden group
                ${isCompleted 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : isLocked 
                    ? 'glass opacity-50 border-white/5 cursor-not-allowed' 
                    : 'glass border-white/10 hover:bg-white/5 hover:border-emerald-400/30'
                }
              `}
            >
              {/* Background Glow */}
              <div className={`absolute -inset-10 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-white'}`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-400 text-[#022c22]' : isLocked ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-emerald-400'}`}>
                  {isLocked ? <Lock className="w-8 h-8" /> : challenge.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-yellow-400">+{challenge.xp} EP</span>
                  {isLocked && <span className="text-xs text-gray-400">Requires {challenge.reqRank} EP</span>}
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-2 relative z-10 ${isCompleted ? 'text-emerald-300' : isLocked ? 'text-gray-400' : 'text-white'}`}>
                {challenge.title}
              </h3>
              <p className="text-sm text-emerald-100/60 mb-6 relative z-10 min-h-[40px]">
                {challenge.desc}
              </p>

              <button
                onClick={() => !isLocked && !isCompleted && setActiveChallenge(challenge)}
                disabled={isLocked || isCompleted}
                className={`w-full py-3 rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2
                  ${isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : isLocked
                      ? 'bg-white/5 text-gray-500'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  }
                `}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Completed
                  </>
                ) : isLocked ? (
                  'Locked'
                ) : (
                  'Start Verification'
                )}
              </button>

              {/* Confetti Animation Overlay */}
              <AnimatePresence>
                {showConfetti === challenge.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-full h-full bg-emerald-400/20 rounded-3xl" />
                    <span className="absolute text-6xl">🎉</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {activeChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-dark border border-white/20 w-full max-w-lg rounded-3xl overflow-hidden relative"
            >
              <button 
                onClick={() => { setActiveChallenge(null); setAnswer(''); setVideo(null); }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                    {activeChallenge.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{activeChallenge.title}</h3>
                    <p className="text-emerald-400 font-semibold">Earn {activeChallenge.xp} EP</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitVerification} className="space-y-6">
                  {/* Question Input */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-2">
                      {activeChallenge.question}
                    </label>
                    <textarea
                      required
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                      rows={3}
                      placeholder="Write your answer here..."
                    />
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-2">
                      Upload Proof (Video)
                    </label>
                    <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-emerald-500/50 rounded-xl cursor-pointer bg-black/20 hover:bg-white/5 transition-colors">
                      <input 
                        type="file" 
                        accept="video/*" 
                        capture="environment"
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setVideo(e.target.files[0]);
                          }
                        }}
                      />
                      {video ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-8 h-8 text-emerald-400" />
                          <span className="text-sm text-emerald-100 font-medium">{video.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">Click to browse, drag and drop, or record</span>
                          <span className="text-xs opacity-70">MP4, WebM, MOV up to 50MB</span>
                        </div>
                      )}
                    </label>
                  </div>

                  {verificationError && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                      <p className="font-bold mb-1">Verification Failed</p>
                      {verificationError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!answer || !video || isVerifying}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-gray-500 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Analyzing video with AI...
                      </>
                    ) : (
                      'Submit Proof & Claim EP'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
