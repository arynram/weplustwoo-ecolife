"use client";

import { useStore } from '@/store/useStore';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, TreeDeciduous, LightbulbOff, Trash2, Droplet, Recycle, 
  CheckCircle, Lock, Upload, X, Clock,
  Coffee, Bus, Search, ShoppingBag, Leaf, Droplets, BatteryCharging, Factory, Zap, Star
} from 'lucide-react';
import { useState, useEffect } from 'react';

const CHALLENGES_DATA = [
  // Sample / Demo
  { id: 'demo_sample', title: '🎯 Sample Eco Challenge', xp: 1000, envRewards: {}, icon: <Star className="w-8 h-8 text-yellow-400" />, desc: 'Complete this sample challenge to get EP and try the Eco Map.', reqRank: 0, question: 'Are you ready to restore the environment?' },
  // Original 6
  { id: 'bike', title: 'Ride a Bicycle', xp: 20, envRewards: { carbonSaved: 5 }, icon: <Bike className="w-8 h-8" />, desc: 'Use a bicycle for your daily commute instead of a car.', reqRank: 0, question: 'How many kilometers did you ride today?' },
  { id: 'tree', title: 'Plant a Tree', xp: 50, envRewards: { treesSaved: 1 }, icon: <TreeDeciduous className="w-8 h-8" />, desc: 'Plant a tree in your local community or garden.', reqRank: 0, question: 'What type of tree did you plant?' },
  { id: 'light', title: 'Turn Off Unused Lights', xp: 10, envRewards: { carbonSaved: 2 }, icon: <LightbulbOff className="w-8 h-8" />, desc: 'Turn off lights when leaving a room.', reqRank: 0, question: 'Which room did you save energy in today?' },
  { id: 'plastic', title: 'Avoid Single-Use Plastic', xp: 15, envRewards: { plasticReduced: 1 }, icon: <Trash2 className="w-8 h-8" />, desc: 'Avoid one single-use plastic item today.', reqRank: 0, question: 'What plastic item did you avoid using?' },
  { id: 'water', title: 'Take a Shorter Shower', xp: 10, envRewards: { waterSaved: 10 }, icon: <Droplet className="w-8 h-8" />, desc: 'Reduce your shower time today.', reqRank: 0, question: 'How many minutes did you save?' },
  { id: 'recycle', title: 'Separate Waste', xp: 15, envRewards: { plasticReduced: 2 }, icon: <Recycle className="w-8 h-8" />, desc: 'Separate recyclable and non-recyclable waste.', reqRank: 0, question: 'What items did you segregate today?' },
  // New 10
  { id: 'reusable_bottle', title: 'Use a Reusable Water Bottle', xp: 10, envRewards: { plasticReduced: 1 }, icon: <Coffee className="w-8 h-8" />, desc: 'Use a reusable bottle instead of a disposable plastic bottle.', reqRank: 0, question: 'What kind of bottle did you use?' },
  { id: 'public_transport', title: 'Use Public Transport', xp: 20, envRewards: { carbonSaved: 4 }, icon: <Bus className="w-8 h-8" />, desc: 'Use public transport instead of a private vehicle for one trip.', reqRank: 0, question: 'Which public transport did you take?' },
  { id: 'small_plant', title: 'Plant a Small Plant', xp: 25, envRewards: { treesSaved: 0.5 }, icon: <Leaf className="w-8 h-8" />, desc: 'Plant or care for a plant today.', reqRank: 0, question: 'What plant did you care for?' },
  { id: 'reuse_item', title: 'Reuse Before Throwing Away', xp: 15, envRewards: { carbonSaved: 1 }, icon: <Search className="w-8 h-8" />, desc: 'Reuse an item instead of throwing it away.', reqRank: 0, question: 'What item did you repurpose?' },
  { id: 'cloth_bag', title: 'Carry a Cloth Bag', xp: 10, envRewards: { plasticReduced: 1 }, icon: <ShoppingBag className="w-8 h-8" />, desc: 'Use a reusable cloth bag while shopping.', reqRank: 0, question: 'Where did you go shopping with your cloth bag?' },
  { id: 'save_water', title: 'Save Water', xp: 10, envRewards: { waterSaved: 5 }, icon: <Droplets className="w-8 h-8" />, desc: 'Avoid unnecessary water usage today.', reqRank: 0, question: 'How did you save water today?' },
  { id: 'unplug_electronics', title: 'Unplug Electronics', xp: 15, envRewards: { carbonSaved: 2 }, icon: <Zap className="w-8 h-8" />, desc: 'Unplug fully charged devices and electronics not in use.', reqRank: 0, question: 'What device did you unplug?' },
  { id: 'eat_plant_based', title: 'Eat a Plant-Based Meal', xp: 20, envRewards: { carbonSaved: 3 }, icon: <Leaf className="w-8 h-8" />, desc: 'Replace one meat-based meal with a plant-based alternative.', reqRank: 0, question: 'What plant-based meal did you enjoy?' },
  { id: 'rechargeable_batteries', title: 'Use Rechargeable Batteries', xp: 15, envRewards: { carbonSaved: 1 }, icon: <BatteryCharging className="w-8 h-8" />, desc: 'Use rechargeable batteries instead of disposable ones.', reqRank: 0, question: 'What device did you power?' },
  { id: 'second_hand', title: 'Buy Second-Hand', xp: 20, envRewards: { carbonSaved: 5 }, icon: <Factory className="w-8 h-8" />, desc: 'Purchase a second-hand item instead of something new.', reqRank: 0, question: 'What did you buy second-hand?' },
];

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function formatTimeLeft(ms: number) {
  if (ms <= 0) return '0h 0m 0s';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function ChallengeCard({ 
  challenge, 
  xp, 
  lastCompletedAt, 
  onStart 
}: { 
  challenge: typeof CHALLENGES_DATA[0], 
  xp: number, 
  lastCompletedAt: number,
  onStart: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = COOLDOWN_MS - (Date.now() - lastCompletedAt);
      setTimeLeft(Math.max(0, remaining));
    };

    if (lastCompletedAt > 0) {
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(0);
    }
  }, [lastCompletedAt]);

  const isLocked = xp < challenge.reqRank;
  const inCooldown = timeLeft > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden group
        ${inCooldown 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : isLocked 
            ? 'glass opacity-50 border-white/5 cursor-not-allowed' 
            : 'glass border-white/10 hover:bg-white/5 hover:border-emerald-400/30'
        }
      `}
    >
      {/* Background Glow */}
      <div className={`absolute -inset-10 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl rounded-full ${inCooldown ? 'bg-emerald-400' : 'bg-white'}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${inCooldown ? 'bg-emerald-400 text-[#022c22]' : isLocked ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-emerald-400'}`}>
          {isLocked ? <Lock className="w-8 h-8" /> : challenge.icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-yellow-400">+{challenge.xp} EP</span>
          {isLocked && <span className="text-xs text-gray-400">Requires {challenge.reqRank} EP</span>}
        </div>
      </div>

      <h3 className={`text-xl font-bold mb-2 relative z-10 ${inCooldown ? 'text-emerald-300' : isLocked ? 'text-gray-400' : 'text-white'}`}>
        {challenge.title}
      </h3>
      <p className="text-sm text-emerald-100/60 mb-6 relative z-10 min-h-[40px]">
        {challenge.desc}
      </p>

      {inCooldown ? (
        <div className="w-full py-2 px-4 rounded-xl font-bold relative z-10 flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-center">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4" /> <span>Completed</span>
          </div>
          <span className="text-xs font-normal opacity-80 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Available again in:
          </span>
          <span className="text-sm tracking-wider font-mono">{formatTimeLeft(timeLeft)}</span>
        </div>
      ) : (
        <button
          onClick={onStart}
          disabled={isLocked}
          className={`w-full py-3 rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2
            ${isLocked
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-95'
            }
          `}
        >
          {isLocked ? 'Locked' : 'Complete Challenge'}
        </button>
      )}
    </motion.div>
  );
}

export function Challenges() {
  const { data: session } = useSession();
  const { xp, challengeCompletions, completeChallenge } = useStore();
  const [showConfetti, setShowConfetti] = useState<string | null>(null);
  
  const [visibleCount, setVisibleCount] = useState(6);

  // Verification Modal State
  const [activeChallenge, setActiveChallenge] = useState<typeof CHALLENGES_DATA[0] | null>(null);
  const [answer, setAnswer] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [declaration, setDeclaration] = useState(false);
  
  // AI Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge || !declaration || isVerifying) return;
    
    setIsVerifying(true);
    setVerificationError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      if (video) {
        formData.append('video', video);
      }
      formData.append('challengeTitle', activeChallenge.title);
      formData.append('challengeId', activeChallenge.id);
      formData.append('declaration', 'true');
      if (session?.user?.email) {
        formData.append('email', session.user.email);
      }
      formData.append('xp', activeChallenge.xp.toString());
      if (activeChallenge.envRewards) {
        formData.append('envRewards', JSON.stringify(activeChallenge.envRewards));
      }

      const res = await fetch('/api/verify-challenge', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.isApproved) {
        completeChallenge(activeChallenge.id, activeChallenge.xp, activeChallenge.envRewards);
        setSuccessMessage(`✓ Challenge Complete! +${activeChallenge.xp} EP`);
        setShowConfetti(activeChallenge.id);
        
        // Let user see success briefly before closing modal
        setTimeout(() => {
          setShowConfetti(null);
          setActiveChallenge(null);
          setAnswer('');
          setVideo(null);
          setDeclaration(false);
          setSuccessMessage(null);
        }, 2000);
      } else {
        setVerificationError(data.reason || data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, CHALLENGES_DATA.length));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHALLENGES_DATA.slice(0, visibleCount).map((challenge) => {
          const lastCompletedAt = challengeCompletions[challenge.id] || 0;
          return (
            <ChallengeCard 
              key={challenge.id}
              challenge={challenge}
              xp={xp}
              lastCompletedAt={lastCompletedAt}
              onStart={() => {
                setActiveChallenge(challenge);
                setAnswer('');
                setVideo(null);
                setDeclaration(false);
                setVerificationError(null);
                setSuccessMessage(null);
              }}
            />
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        {visibleCount < CHALLENGES_DATA.length ? (
          <button
            onClick={handleShowMore}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/20 hover:border-white/40 flex items-center gap-2 active:scale-95"
          >
            + MORE CHALLENGES
          </button>
        ) : (
          <div className="px-8 py-4 bg-white/5 text-gray-400 font-medium rounded-full border border-white/5">
            All challenges loaded
          </div>
        )}
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
              {!successMessage && (
                <button 
                  onClick={() => { setActiveChallenge(null); setAnswer(''); setVideo(null); }}
                  disabled={isVerifying}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="p-8">
                {successMessage ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
                     <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10" />
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-2">Awesome!</h3>
                     <p className="text-xl text-emerald-400 font-semibold">{successMessage}</p>
                     
                     {showConfetti && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                         <span className="text-7xl animate-bounce">🎉</span>
                       </div>
                     )}
                  </div>
                ) : (
                  <>
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
                          disabled={isVerifying}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-100 mb-2">
                          Upload Proof (Video/Photo) - Optional
                        </label>
                        <label className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl transition-colors ${isVerifying ? 'cursor-not-allowed opacity-50 bg-black/20' : 'cursor-pointer hover:border-emerald-500/50 bg-black/20 hover:bg-white/5'}`}>
                          <input 
                            type="file" 
                            accept="image/*,video/*" 
                            capture="environment"
                            className="hidden" 
                            disabled={isVerifying}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setVideo(e.target.files[0]);
                              }
                            }}
                          />
                          {video ? (
                            <div className="flex flex-col items-center gap-2">
                              <CheckCircle className="w-8 h-8 text-emerald-400" />
                              <span className="text-sm text-emerald-100 font-medium truncate max-w-full px-4">{video.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400 text-center">
                              <Upload className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">Click to browse, drag and drop, or record</span>
                              <span className="text-xs opacity-70">Optional visual proof</span>
                            </div>
                          )}
                        </label>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <input
                          type="checkbox"
                          id="declaration"
                          checked={declaration}
                          onChange={(e) => setDeclaration(e.target.checked)}
                          required
                          disabled={isVerifying}
                          className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label
                          htmlFor="declaration"
                          className={`text-sm text-emerald-100/80 ${isVerifying ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          I confirm that I am providing correct and truthful information about this challenge.
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
                        disabled={!answer || !declaration || isVerifying}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-gray-500 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100"
                      >
                        {isVerifying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
