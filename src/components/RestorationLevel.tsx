"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { X, Play, Heart, Sprout } from 'lucide-react';

interface RestorationObject {
  id: string;
  type: 'tree' | 'water' | 'land' | 'garbage' | 'factory' | 'smoke';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  cost: number;
  label: string;
  description: string;
}

interface LevelConfig {
  id: string;
  name: string;
  story: string;
  bgColors: string;
  restoredBgColors: string;
  objects: RestorationObject[];
}

const LEVELS: Record<string, LevelConfig> = {
  home: {
    id: 'home',
    name: 'Happy Village',
    story: 'Happy Village was once surrounded by greenery. Years of neglect have left its trees dry, its land barren and its pond polluted. Use your EP to bring the village back to life.',
    bgColors: 'from-orange-100 to-yellow-100', // Dry village
    restoredBgColors: 'from-green-300 to-emerald-200', // Healthy village
    objects: [
      { id: 'home-tree-1', type: 'tree', x: 25, y: 35, cost: 20, label: 'Dry Tree', description: 'Restore this tree and bring greenery back to Happy Village.' },
      { id: 'home-tree-2', type: 'tree', x: 80, y: 45, cost: 20, label: 'Dry Tree', description: 'A little care will help this tree grow strong again.' },
      { id: 'home-pond', type: 'water', x: 50, y: 70, cost: 30, label: 'Dirty Pond', description: 'Clean this pond to restore fresh water to the village.' },
      { id: 'home-land', type: 'land', x: 30, y: 65, cost: 25, label: 'Barren Land', description: 'Heal the cracked soil so grass can grow.' },
    ]
  },
  forest: {
    id: 'forest',
    name: 'Polluted Village',
    story: 'Polluted Village is suffering from plastic waste, dirty water and unhealthy air. Restore its environment one step at a time.',
    bgColors: 'from-stone-400 to-stone-300',
    restoredBgColors: 'from-emerald-300 to-teal-200',
    objects: [
      { id: 'forest-tree-1', type: 'tree', x: 15, y: 25, cost: 25, label: 'Dying Tree', description: 'This tree needs clean soil to survive.' },
      { id: 'forest-tree-2', type: 'tree', x: 30, y: 40, cost: 25, label: 'Dying Tree', description: 'Restore this tree to improve the air quality.' },
      { id: 'forest-tree-3', type: 'tree', x: 75, y: 20, cost: 25, label: 'Dying Tree', description: 'Give this tree the nutrients it needs.' },
      { id: 'forest-tree-4', type: 'tree', x: 85, y: 50, cost: 25, label: 'Dying Tree', description: 'Heal this tree to create shade for wildlife.' },
      { id: 'forest-land-1', type: 'land', x: 20, y: 70, cost: 30, label: 'Polluted Land', description: 'Clean the toxic soil to let grass grow.' },
      { id: 'forest-water-1', type: 'water', x: 50, y: 65, cost: 40, label: 'Toxic Water', description: 'Filter the water to bring life back to the lake.' },
      { id: 'forest-garbage-1', type: 'garbage', x: 40, y: 85, cost: 15, label: 'Plastic Waste', description: 'Recycle this waste to clean the area.' },
      { id: 'forest-garbage-2', type: 'garbage', x: 80, y: 65, cost: 15, label: 'Garbage Pile', description: 'Remove this hazardous pile of garbage.' },
    ]
  },
  solar: {
    id: 'solar',
    name: 'Industrial Area',
    story: 'Industrial Area has grown rapidly, but pollution has damaged its river, land and vegetation. Restore the balance.',
    bgColors: 'from-gray-500 to-zinc-400',
    restoredBgColors: 'from-sky-300 to-green-200',
    objects: [
      { id: 'solar-factory-1', type: 'factory', x: 20, y: 30, cost: 60, label: 'Polluting Factory', description: 'Upgrade this factory with eco-friendly technology.' },
      { id: 'solar-smoke-1', type: 'smoke', x: 25, y: 15, cost: 40, label: 'Thick Smoke', description: 'Install filters to clear the harmful smoke.' },
      { id: 'solar-tree-1', type: 'tree', x: 75, y: 35, cost: 30, label: 'Dead Tree', description: 'Revive this tree in the industrial zone.' },
      { id: 'solar-tree-2', type: 'tree', x: 85, y: 25, cost: 30, label: 'Dead Tree', description: 'Plant a new tree to combat emissions.' },
      { id: 'solar-river-1', type: 'water', x: 50, y: 75, cost: 50, label: 'Chemical River', description: 'Neutralize the chemicals in the river.' },
      { id: 'solar-garbage-1', type: 'garbage', x: 30, y: 80, cost: 20, label: 'Industrial Waste', description: 'Safely dispose of this toxic waste.' },
      { id: 'solar-garbage-2', type: 'garbage', x: 70, y: 65, cost: 20, label: 'Metal Scrap', description: 'Recycle these discarded materials.' },
      { id: 'solar-land-1', type: 'land', x: 80, y: 85, cost: 40, label: 'Barren Soil', description: 'Restore the soil health.' },
    ]
  },
  wind: {
    id: 'wind',
    name: 'Breezy Valley',
    story: 'The winds here are strong, but the valley needs your help to thrive again.',
    bgColors: 'from-slate-400 to-stone-300',
    restoredBgColors: 'from-blue-300 to-sky-200',
    objects: [
      { id: 'wind-tree-1', type: 'tree', x: 40, y: 50, cost: 20, label: 'Dry Tree', description: 'Restore this tree to its former glory.' },
      { id: 'wind-land-1', type: 'land', x: 60, y: 70, cost: 25, label: 'Barren Land', description: 'Heal the land.' },
    ]
  }
};

// --- Custom SVG Components for Diorama Graphics ---

const TreeSprite = ({ isRestored }: { isRestored: boolean }) => (
  <svg viewBox="0 0 100 120" className="w-16 h-20 md:w-24 md:h-32 drop-shadow-xl overflow-visible">
    {/* Trunk */}
    <path d="M 45 120 C 45 100, 40 80, 50 60 C 60 80, 55 100, 55 120 Z" fill={isRestored ? "#78350f" : "#451a03"} />
    <path d="M 50 80 C 40 70, 30 65, 25 60" stroke={isRestored ? "#78350f" : "#451a03"} strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 50 70 C 65 65, 70 60, 75 55" stroke={isRestored ? "#78350f" : "#451a03"} strokeWidth="3" fill="none" strokeLinecap="round" />
    
    {/* Leaves */}
    <motion.g
      initial={false}
      animate={isRestored ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="origin-bottom"
    >
      <circle cx="50" cy="40" r="35" fill="#15803d" />
      <circle cx="30" cy="50" r="25" fill="#166534" />
      <circle cx="70" cy="50" r="25" fill="#166534" />
      <circle cx="50" cy="20" r="25" fill="#22c55e" />
    </motion.g>
  </svg>
);

const PondSprite = ({ isRestored }: { isRestored: boolean }) => (
  <svg viewBox="0 0 200 100" className="w-32 h-16 md:w-48 md:h-24 drop-shadow-md">
    {/* Pond Base */}
    <ellipse cx="100" cy="50" rx="90" ry="40" fill={isRestored ? "#3b82f6" : "#422006"} className="transition-colors duration-1000" />
    <ellipse cx="100" cy="52" rx="80" ry="35" fill={isRestored ? "#60a5fa" : "#713f12"} className="transition-colors duration-1000" />
    
    {/* Dirty items */}
    <motion.g animate={{ opacity: isRestored ? 0 : 1 }} transition={{ duration: 0.5 }}>
      <path d="M 60 40 L 70 45 L 65 50 Z" fill="#854d0e" />
      <circle cx="120" cy="60" r="5" fill="#3f3f46" />
      <path d="M 140 40 Q 150 30 160 45" stroke="#451a03" strokeWidth="2" fill="none" />
    </motion.g>

    {/* Restored items */}
    <motion.g animate={{ opacity: isRestored ? 1 : 0 }} transition={{ duration: 0.5 }}>
      {/* Lilypad */}
      <path d="M 60 50 A 15 10 0 1 1 80 55 L 70 50 Z" fill="#4ade80" />
      {/* Ripples */}
      <ellipse cx="120" cy="50" rx="20" ry="8" fill="none" stroke="#bfdbfe" strokeWidth="2" opacity="0.6" />
      <ellipse cx="120" cy="50" rx="30" ry="12" fill="none" stroke="#bfdbfe" strokeWidth="1" opacity="0.4" />
    </motion.g>
  </svg>
);

const LandSprite = ({ isRestored }: { isRestored: boolean }) => (
  <svg viewBox="0 0 150 80" className="w-24 h-12 md:w-36 md:h-16 drop-shadow-sm">
    <path d="M 10 40 Q 75 0 140 40 Q 120 80 75 80 Q 20 70 10 40 Z" fill={isRestored ? "#84cc16" : "#a16207"} className="transition-colors duration-1000" />
    
    {/* Cracks */}
    <motion.g animate={{ opacity: isRestored ? 0 : 1 }} stroke="#713f12" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M 40 40 L 50 50 L 45 60" />
      <path d="M 90 30 L 100 45 L 115 40" />
      <path d="M 70 50 L 80 65" />
    </motion.g>

    {/* Sprouts */}
    <motion.g animate={{ scale: isRestored ? 1 : 0, opacity: isRestored ? 1 : 0 }} transition={{ duration: 0.8 }} fill="#15803d" className="origin-bottom">
      <path d="M 40 50 Q 35 35 45 35 Q 40 45 40 50 Z" />
      <path d="M 40 50 Q 45 40 50 45 Q 42 48 40 50 Z" />
      
      <path d="M 100 40 Q 95 25 105 25 Q 100 35 100 40 Z" />
      <path d="M 100 40 Q 105 30 110 35 Q 102 38 100 40 Z" />
    </motion.g>
  </svg>
);

const GarbageSprite = ({ isRestored }: { isRestored: boolean }) => (
  <svg viewBox="0 0 80 60" className="w-12 h-10 md:w-16 md:h-12 drop-shadow-md">
    <motion.g animate={{ scale: isRestored ? 0 : 1, opacity: isRestored ? 0 : 1 }} transition={{ duration: 0.5 }}>
      {/* Trash Bags & Plastic */}
      <path d="M 20 50 C 10 50, 10 30, 25 25 C 35 20, 40 40, 45 50 Z" fill="#52525b" />
      <path d="M 40 50 C 30 50, 35 25, 50 20 C 70 15, 70 45, 60 50 Z" fill="#3f3f46" />
      <rect x="25" y="35" width="15" height="8" rx="2" fill="#ef4444" transform="rotate(-15 25 35)" />
      <rect x="50" y="40" width="10" height="5" rx="2" fill="#3b82f6" transform="rotate(25 50 40)" />
    </motion.g>
    <motion.g animate={{ scale: isRestored ? 1 : 0, opacity: isRestored ? 1 : 0 }} transition={{ duration: 0.5 }}>
      <circle cx="40" cy="40" r="15" fill="#4ade80" opacity="0.3" />
      <path d="M 40 45 Q 35 30 45 30 Q 40 40 40 45 Z" fill="#15803d" />
    </motion.g>
  </svg>
);

const FactorySprite = ({ isRestored }: { isRestored: boolean }) => (
  <svg viewBox="0 0 120 120" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl">
    <path d="M 10 110 L 10 60 L 40 60 L 40 40 L 70 40 L 70 70 L 110 70 L 110 110 Z" fill={isRestored ? "#94a3b8" : "#334155"} className="transition-colors duration-1000" />
    <path d="M 20 40 L 30 40 L 30 60 L 20 60 Z" fill={isRestored ? "#94a3b8" : "#334155"} className="transition-colors duration-1000" />
    
    {/* Windows */}
    <rect x="20" y="80" width="10" height="15" fill={isRestored ? "#38bdf8" : "#fbbf24"} />
    <rect x="50" y="80" width="10" height="15" fill={isRestored ? "#38bdf8" : "#fbbf24"} />
    <rect x="80" y="80" width="10" height="15" fill={isRestored ? "#38bdf8" : "#fbbf24"} />
    
    {/* Eco Upgrade */}
    <motion.g animate={{ opacity: isRestored ? 1 : 0 }} transition={{ duration: 1 }}>
      <rect x="40" y="30" width="30" height="10" fill="#0ea5e9" /> {/* Solar panel */}
      <line x1="45" y1="30" x2="45" y2="40" stroke="#0284c7" strokeWidth="1" />
      <line x1="55" y1="30" x2="55" y2="40" stroke="#0284c7" strokeWidth="1" />
      <line x1="65" y1="30" x2="65" y2="40" stroke="#0284c7" strokeWidth="1" />
      <path d="M 100 70 L 100 50" stroke="#22c55e" strokeWidth="4" />
      <circle cx="100" cy="50" r="10" fill="#15803d" /> {/* Roof garden */}
    </motion.g>
  </svg>
);

const SmokeSprite = ({ isRestored }: { isRestored: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32 pointer-events-none">
    <motion.g 
      animate={{ 
        opacity: isRestored ? 0 : [0.6, 0.8, 0.6], 
        y: isRestored ? -50 : [0, -10, 0],
        scale: isRestored ? 2 : 1
      }} 
      transition={{ duration: isRestored ? 1 : 3, repeat: isRestored ? 0 : Infinity }}
    >
      <circle cx="40" cy="50" r="30" fill="#52525b" opacity="0.8" style={{ filter: 'blur(5px)' }} />
      <circle cx="70" cy="40" r="25" fill="#3f3f46" opacity="0.7" style={{ filter: 'blur(3px)' }} />
      <circle cx="50" cy="20" r="35" fill="#71717a" opacity="0.6" style={{ filter: 'blur(4px)' }} />
    </motion.g>
  </svg>
);

// --- Main Component ---

export default function RestorationLevel({ levelId, onClose, onNextLevel }: { levelId: string, onClose: () => void, onNextLevel?: (nextId: string) => void }) {
  const { xp, restoredObjects, restoreObject } = useStore();
  const [activeObject, setActiveObject] = useState<RestorationObject | null>(null);
  const [storyActive, setStoryActive] = useState(true);

  const level = LEVELS[levelId];
  if (!level) return null;

  const restoredCount = level.objects.filter(obj => restoredObjects[obj.id]).length;
  const totalObjects = level.objects.length;
  const progressPercent = Math.round((restoredCount / totalObjects) * 100);
  const isComplete = restoredCount === totalObjects;

  const handleRestore = () => {
    if (activeObject && xp >= activeObject.cost && !restoredObjects[activeObject.id]) {
      restoreObject(activeObject.id, activeObject.cost);
      setActiveObject(null);
    }
  };

  const nextLevelMap: Record<string, string | null> = {
    home: 'forest',
    forest: 'solar',
    solar: null,
    wind: null
  };
  const nextLevelId = nextLevelMap[levelId];

  const renderObject = (obj: RestorationObject) => {
    const isRestored = !!restoredObjects[obj.id];
    switch (obj.type) {
      case 'tree': return <TreeSprite isRestored={isRestored} />;
      case 'water': return <PondSprite isRestored={isRestored} />;
      case 'land': return <LandSprite isRestored={isRestored} />;
      case 'garbage': return <GarbageSprite isRestored={isRestored} />;
      case 'factory': return <FactorySprite isRestored={isRestored} />;
      case 'smoke': return <SmokeSprite isRestored={isRestored} />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden"
    >
      {/* Background Diorama Gradient */}
      <div className={`absolute inset-0 bg-linear-to-b ${isComplete ? level.restoredBgColors : level.bgColors} transition-colors duration-2000`} />
      
      {/* Haze overlay for polluted levels */}
      {!isComplete && (level.id === 'forest' || level.id === 'solar') && (
        <div className="absolute inset-0 bg-stone-500/20 mix-blend-multiply pointer-events-none transition-opacity duration-2000" />
      )}

      {/* Decorative Horizon Elements */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-black/5" />
      <svg className="absolute top-[20%] w-full h-32 opacity-20 pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path d="M 0 100 L 0 50 Q 250 0 500 50 T 1000 50 L 1000 100 Z" fill="currentColor" className="text-white" />
      </svg>
      {level.id === 'home' && (
        <div className="absolute top-[35%] left-[60%] opacity-80 pointer-events-none drop-shadow-md">
           <svg width="80" height="60" viewBox="0 0 80 60">
             <rect x="20" y="30" width="40" height="30" fill="#fef3c7" />
             <polygon points="10,30 40,10 70,30" fill="#b45309" />
             <rect x="35" y="45" width="10" height="15" fill="#78350f" />
           </svg>
        </div>
      )}

      {/* Header UI */}
      <div className="relative z-10 flex justify-between items-center p-4 md:p-6 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 flex flex-col gap-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-none">{level.name}</h2>
          <div className="flex items-center gap-2">
            <div className="w-24 md:w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-linear-to-r from-green-400 to-emerald-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-500">{progressPercent}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
            <span className="font-extrabold text-slate-700 text-lg">{xp} EP</span>
          </div>
          <button onClick={onClose} className="p-3 bg-white/90 backdrop-blur-md hover:bg-white text-slate-600 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 border border-white/50">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Playable Area */}
      <div className="relative flex-1 w-full h-full">
        {level.objects.map(obj => {
          const isRestored = !!restoredObjects[obj.id];
          const isActive = activeObject?.id === obj.id;
          // For smoke, we don't want a button, just render it over its target
          if (obj.type === 'smoke') {
            return (
              <div key={obj.id} className="absolute pointer-events-none" style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                {renderObject(obj)}
              </div>
            );
          }

          return (
            <motion.button
              key={obj.id}
              whileHover={!isRestored && !storyActive ? { scale: 1.05 } : {}}
              whileTap={!isRestored && !storyActive ? { scale: 0.95 } : {}}
              onClick={() => {
                if (!isRestored && !storyActive) setActiveObject(obj);
              }}
              className={`absolute group outline-none ${isRestored ? 'pointer-events-none' : 'cursor-pointer'} ${isActive ? 'z-20' : 'z-10'}`}
              style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Ground Highlight when Active */}
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-4 bg-white/40 blur-md rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
              )}
              
              {renderObject(obj)}

              {/* Indicator for damaged items */}
              {!isRestored && !storyActive && !isActive && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap pointer-events-none border border-slate-200">
                  Needs Healing
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Story Intro Panel */}
      <AnimatePresence>
        {storyActive && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/20 backdrop-blur-xs"
          >
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm text-center border-4 border-emerald-100 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-100 rounded-full opacity-50 blur-2xl" />
              
              <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase relative z-10">{level.name}</h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 relative z-10 text-lg">
                {level.story}
              </p>
              <button 
                onClick={() => setStoryActive(false)}
                className="w-full py-4 bg-linear-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 relative z-10"
              >
                Let's Heal <Play className="w-5 h-5 fill-current" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Banner */}
      <AnimatePresence>
        {isComplete && !storyActive && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-2xl border-2 border-emerald-300 text-center w-[90%] max-w-md"
          >
            <h3 className="text-2xl font-black text-emerald-600 mb-2 uppercase tracking-wide flex items-center justify-center gap-2">
              <Sprout className="w-6 h-6" /> {level.name} Restored!
            </h3>
            <p className="text-emerald-800/80 font-bold mb-6">Your actions brought the area back to life.</p>
            {onNextLevel && nextLevelId ? (
              <button 
                onClick={() => onNextLevel(nextLevelId)}
                className="w-full py-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                NEXT LEVEL →
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                BACK TO ECO MAP
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked Action Panel */}
      <AnimatePresence>
        {activeObject && !isComplete && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-slate-100 p-6 md:p-8"
          >
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{activeObject.label}</h4>
                  <button onClick={() => setActiveObject(null)} className="md:hidden p-2 bg-slate-100 text-slate-500 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-slate-600 font-medium mb-4">{activeObject.description}</p>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl font-bold border border-amber-200">
                    Cost: {activeObject.cost} EP
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100">
                    Your EP: {xp}
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex items-center gap-4">
                <button 
                  onClick={handleRestore}
                  disabled={xp < activeObject.cost}
                  className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 ${
                    xp >= activeObject.cost 
                      ? 'bg-linear-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white hover:shadow-xl hover:-translate-y-1' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {xp >= activeObject.cost ? 'RESTORE' : 'NOT ENOUGH EP'}
                </button>
                <button onClick={() => setActiveObject(null)} className="hidden md:flex p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
