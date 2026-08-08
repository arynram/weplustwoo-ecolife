"use client";

import { useStore } from '@/store/useStore';
import { useUIStore } from '@/store/useUIStore';
import { motion } from 'framer-motion';
import { Droplet, Factory, Trees, Recycle, Trophy, Map, Target, Leaf, Calculator as CalculatorIcon, ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const { ecoScore, xp, carbonSaved, treesSaved, waterSaved, plasticReduced } = useStore();

  const stats = [
    { label: 'Carbon Saved', value: `${carbonSaved} kg`, icon: <Factory className="text-gray-400" />, color: 'from-gray-500 to-gray-700' },
    { label: 'Trees Saved', value: treesSaved, icon: <Trees className="text-emerald-400" />, color: 'from-emerald-400 to-green-600' },
    { label: 'Water Saved', value: `${waterSaved} L`, icon: <Droplet className="text-blue-400" />, color: 'from-blue-400 to-cyan-600' },
    { label: 'Plastic Reduced', value: `${plasticReduced} kg`, icon: <Recycle className="text-teal-400" />, color: 'from-teal-400 to-emerald-600' }
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  const currentLevelXP = xp % 100;
  const rankName = ecoScore < 10 ? '🌱 Beginner' : ecoScore < 50 ? '🌿 Eco Warrior' : '🌳 Green Hero';

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Player Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/10"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-yellow-400/20 to-yellow-600/20 flex flex-col items-center justify-center border-2 border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
                <span className="text-xs font-bold text-yellow-400">Lvl {ecoScore}</span>
              </div>
              <div>
                <h3 className="text-xl text-emerald-100/80 mb-1 font-medium">Current Rank</h3>
                <h4 className="text-3xl font-black text-white">{rankName}</h4>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-sm text-emerald-100/60 font-medium mb-1">Total Energy Points</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-teal-500">
                {xp} <span className="text-2xl text-emerald-300/80">EP</span>
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between text-sm font-medium text-emerald-100/80 mb-3">
              <span>Progress to Level {ecoScore + 1}</span>
              <span className="text-emerald-300">{currentLevelXP} / 100 EP</span>
            </div>
            <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentLevelXP}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] relative overflow-hidden"
              >
                {/* Shine effect on progress bar */}
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons HUD */}
        <div className="col-span-1 flex flex-col gap-3">
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onClick={() => useUIStore.getState().setActiveFeature('map')}
            className="flex-1 glass border border-sky-400/30 p-5 rounded-3xl hover:bg-sky-500/20 transition-all flex items-center justify-between group cursor-pointer hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Map className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-sky-100">Explore Eco Map</span>
            </div>
            <span className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">→</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => useUIStore.getState().setActiveFeature('challenges')}
            className="flex-1 glass border border-emerald-400/30 p-5 rounded-3xl hover:bg-emerald-500/20 transition-all flex items-center justify-between group cursor-pointer hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100">Earn Energy Points</span>
            </div>
            <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">→</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onClick={() => useUIStore.getState().setActiveFeature('impact')}
            className="flex-1 glass border border-green-400/30 p-5 rounded-3xl hover:bg-green-500/20 transition-all flex items-center justify-between group cursor-pointer hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-green-100">Green Impact</span>
            </div>
            <span className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">→</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={() => useUIStore.getState().setActiveFeature('calculator')}
            className="flex-1 glass border border-amber-400/30 p-5 rounded-3xl hover:bg-amber-500/20 transition-all flex items-center justify-between group cursor-pointer hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                <CalculatorIcon className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-amber-100">Estimate Green Impact</span>
            </div>
            <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">→</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            onClick={() => useUIStore.getState().setActiveFeature('leaderboard')}
            className="flex-1 glass border border-purple-400/30 p-5 rounded-3xl hover:bg-purple-500/20 transition-all flex items-center justify-between group cursor-pointer hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                <ListOrdered className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-purple-100">Leaderboard</span>
            </div>
            <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">→</span>
          </motion.button>
        </div>
      </div>

    </div>
  );
}
