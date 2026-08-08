"use client";

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { CHALLENGES_DATA } from '@/lib/challenges';
import { Factory, Trees, Droplet, Recycle, CheckCircle, Leaf } from 'lucide-react';

export function GreenImpact() {
  const { carbonSaved, treesSaved, waterSaved, plasticReduced, completedChallenges } = useStore();

  const totalActivities = completedChallenges.length;
  
  // Find recent actions based on completed challenges
  // Since we just have the IDs, let's reverse them to show the newest first
  const recentActionIds = [...completedChallenges].reverse().slice(0, 4);
  const recentActions = recentActionIds.map(id => CHALLENGES_DATA.find(c => c.id === id)).filter(Boolean);

  const stats = [
    { label: 'CO₂e Saved', value: `${carbonSaved} kg`, icon: <Factory className="text-gray-400" /> },
    { label: 'Trees Planted/Saved', value: treesSaved, icon: <Trees className="text-emerald-400" /> },
    { label: 'Water Saved', value: `${waterSaved} L`, icon: <Droplet className="text-blue-400" /> },
    { label: 'Waste Diverted', value: `${plasticReduced} kg`, icon: <Recycle className="text-teal-400" /> }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Main Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Your Green Impact</h3>
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-emerald-500">
                {totalActivities}
              </span>
              <span className="text-xl text-green-100/80 ml-3 font-medium">Green Activities Completed</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-white/5">
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium text-emerald-100/60">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between text-sm font-medium text-emerald-100/80 mb-3">
              <span>Next Impact Milestone</span>
              <span className="text-green-300">{totalActivities} / 20 Activities</span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalActivities / 20) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-green-500 to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Recent Actions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Recent Green Actions</h3>
          
          {recentActions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentActions.map((action, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                    {action?.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{action?.title}</h4>
                    <div className="text-sm text-emerald-100/60 flex flex-wrap gap-x-3 mt-1">
                      {action?.envRewards?.carbonSaved && <span>CO₂e Avoided: {action.envRewards.carbonSaved}kg</span>}
                      {action?.envRewards?.waterSaved && <span>Water Saved: {action.envRewards.waterSaved}L</span>}
                      {action?.envRewards?.plasticReduced && <span>Waste Diverted: {action.envRewards.plasticReduced}kg</span>}
                      {action?.envRewards?.treesSaved && <span>Trees Planted: {action.envRewards.treesSaved}</span>}
                      {!Object.keys(action?.envRewards || {}).length && <span>General Eco Action</span>}
                    </div>
                  </div>
                  <div className="text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6 border-2 border-dashed border-white/10 rounded-2xl">
              <Leaf className="w-12 h-12 text-gray-500 mb-3" />
              <p className="text-gray-400 font-medium">You haven't completed any activities yet.</p>
              <p className="text-sm text-gray-500 mt-1">Complete challenges to see your impact here!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
