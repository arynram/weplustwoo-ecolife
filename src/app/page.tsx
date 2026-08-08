"use client";

import { Calculator } from '@/components/Calculator';
import { Dashboard } from '@/components/Dashboard';
import { EcoMap } from '@/components/EcoMap';
import { GreenImpact } from '@/components/GreenImpact';
import { Challenges } from '@/components/Challenges';
import { Leaderboard } from '@/components/Leaderboard';
import { useUIStore } from '@/store/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { activeFeature, setActiveFeature } = useUIStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      
      {/* Dashboard Section (Always visible at the base) */}
      <section id="dashboard" className="min-h-screen w-full bg-[#022c22] pt-20 pb-24 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-teal-600/10 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-3">Your Green Dashboard</h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">Track your overall progress, level up your eco rank, and see the real-world impact of your sustainable choices.</p>
          </div>
          <Dashboard />
        </div>
      </section>

      {/* Eco Map (Always mounted to preserve WebGL state, visually toggled) */}
      <div 
        className={`fixed inset-0 flex flex-col transition-all duration-300 ${activeFeature === 'map' ? 'z-50 opacity-100 pointer-events-auto bg-[#03362a]' : '-z-10 opacity-0 pointer-events-none'}`}
      >
        <div className="sticky top-0 z-[60] bg-[#03362a]/90 backdrop-blur-md p-6 border-b border-white/10 shadow-md flex-none">
          <button 
            onClick={() => setActiveFeature(null)}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors border border-emerald-500/30 active:scale-95"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex-1 w-full relative">
          <EcoMap forceFullscreen={true} isActive={activeFeature === 'map'} />
        </div>
      </div>

      {/* Fullscreen Overlays for other features */}
      <AnimatePresence>

        {/* Green Impact Overlay */}
        {activeFeature === 'impact' && (
          <motion.div
            key="impact-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#03362a] overflow-y-auto"
          >
            <div className="sticky top-0 z-[60] bg-[#03362a]/90 backdrop-blur-md p-6 border-b border-white/10 shadow-md">
              <button 
                onClick={() => setActiveFeature(null)}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors border border-emerald-500/30 active:scale-95"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-4">Your Real-World Impact</h2>
                <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">See the actual environmental difference you've made through your completed in-game activities.</p>
              </div>
              <GreenImpact />
            </div>
          </motion.div>
        )}

        {/* Challenges Overlay */}
        {activeFeature === 'challenges' && (
          <motion.div
            key="challenges-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#022c22] overflow-y-auto"
          >
            <div className="sticky top-0 z-[60] bg-[#022c22]/90 backdrop-blur-md p-6 border-b border-white/10 shadow-md">
              <button 
                onClick={() => setActiveFeature(null)}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors border border-emerald-500/30 active:scale-95"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12">
              <Challenges />
            </div>
          </motion.div>
        )}

        {/* Calculator Overlay */}
        {activeFeature === 'calculator' && (
          <motion.div
            key="calculator-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#03362a] overflow-y-auto"
          >
            <div className="sticky top-0 z-[60] bg-[#03362a]/90 backdrop-blur-md p-6 border-b border-white/10 shadow-md">
              <button 
                onClick={() => setActiveFeature(null)}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors border border-emerald-500/30 active:scale-95"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-4">Estimate Green Impact</h2>
                <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">Calculate your daily impact and find out where you can improve to earn more EP and unlock new areas in the Eco Map.</p>
              </div>
              <Calculator />
            </div>
          </motion.div>
        )}

        {/* Leaderboard Overlay */}
        {activeFeature === 'leaderboard' && (
          <motion.div
            key="leaderboard-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#022c22] overflow-y-auto"
          >
            <div className="sticky top-0 z-[60] bg-[#022c22]/90 backdrop-blur-md p-6 border-b border-white/10 shadow-md">
              <button 
                onClick={() => setActiveFeature(null)}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors border border-emerald-500/30 active:scale-95"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4">
              <Leaderboard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
