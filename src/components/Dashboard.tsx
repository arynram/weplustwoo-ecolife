"use client";

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Droplet, Factory, Trees, Recycle, Trophy } from 'lucide-react';
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

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 glass p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
          <h3 className="text-xl text-emerald-100/80 mb-2 font-medium">Global Eco Score</h3>
          <div className="flex items-end gap-4">
            <span className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-teal-500">
              {ecoScore}
            </span>
            <span className="text-xl md:text-2xl text-emerald-200/60 mb-2 md:mb-4">pts</span>
          </div>
          <div className="mt-8">
            <div className="flex justify-between text-sm text-emerald-100/60 mb-2">
              <span>Progress to next rank</span>
              <span>{xp % 100} / 100 EP</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xp % 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Current Rank Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 -mt-10 -ml-10 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
          <div className="w-20 h-20 rounded-full bg-yellow-400/20 flex items-center justify-center mb-4 border border-yellow-400/30">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-lg text-emerald-100/80 mb-1">Current Rank</h3>
          <h4 className="text-2xl font-bold text-yellow-400">
            {ecoScore < 10 ? '🌱 Beginner' : ecoScore < 50 ? '🌿 Eco Warrior' : '🌳 Green Hero'}
          </h4>
          <p className="text-sm text-emerald-100/50 mt-4">Complete challenges to rank up!</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i }}
            className="glass p-6 rounded-3xl hover:bg-white/10 transition-colors group cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm md:text-base text-emerald-100/60 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
