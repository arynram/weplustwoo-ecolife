"use client";

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin, TreePine, Sun, Wind, Navigation, Maximize, Minimize, Plus, Minus, Zap } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import RestorationLevel from './RestorationLevel';
import { Challenges } from './Challenges';

const MAP_LOCATIONS = [
  { id: 'home', name: '🏡 Happy Village', pos: [7, 1, 7], icon: <MapPin />, reqXp: 0, description: 'Your cozy starting point! Learn fun eco habits here.' },
  { id: 'forest', name: '🌳 Polluted Village', pos: [-6, 3, 6], icon: <TreePine />, reqXp: 50, description: 'A village that needs your help to clean up pollution.' },
  { id: 'solar', name: '☀️ Industrial Area', pos: [-5, 6, -5], icon: <Sun />, reqXp: 150, description: 'Upgrade the factories with clean technology!' },
  { id: 'wind', name: '💨 Breezy Valley', pos: [3, 9, -3], icon: <Wind />, reqXp: 300, description: 'Giant windmills spinning in the sky making clean power!' }
];

const CURVE_POINTS = [
  new THREE.Vector3(7, 1, 7),
  new THREE.Vector3(0, 2, 9),    // Intermediate: Front
  new THREE.Vector3(-6, 3, 6),
  new THREE.Vector3(-9, 4.5, 0), // Intermediate: Left
  new THREE.Vector3(-5, 6, -5),
  new THREE.Vector3(0, 7.5, -7), // Intermediate: Back
  new THREE.Vector3(3, 9, -3)
];
const PATH_CURVE = new THREE.CatmullRomCurve3(CURVE_POINTS);
const LINE_POINTS = PATH_CURVE.getPoints(50);

function Mountain() {
  return (
    <group>
      {/* Main mountain cone */}
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[12, 10, 8]} />
        <meshStandardMaterial color="#4ade80" flatShading />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, 8.5, 0]}>
        <coneGeometry args={[4, 2.5, 8]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
    </group>
  );
}

function Player({ lifetimeXp }: { lifetimeXp: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    
    let t = 0;
    const xpTargets = [0, 50, 150, 300];
    const tTargets = [0, 2/6, 4/6, 1];

    for (let i = 0; i < 3; i++) {
      if (lifetimeXp >= xpTargets[i] && lifetimeXp < xpTargets[i+1]) {
        const progress = (lifetimeXp - xpTargets[i]) / (xpTargets[i+1] - xpTargets[i]);
        t = tTargets[i] + progress * (tTargets[i+1] - tTargets[i]);
        break;
      } else if (lifetimeXp >= 300) {
        t = 1;
      }
    }

    let targetPos = PATH_CURVE.getPointAt(t);

    // Offset player up slightly so they sit on the path
    targetPos.y += 0.5;
    
    // Smoothly animate to target
    ref.current.position.lerp(targetPos, 0.05);
    
    // Rotate character to face center mountain slightly
    ref.current.lookAt(0, targetPos.y, 0);

    // Subtle breathing/idle animation instead of aggressive bouncing
    const time = state.clock.getElapsedTime();
    ref.current.position.y += Math.sin(time * 2) * 0.02;
  });

  return (
    <group ref={ref} scale={0.4} position={[7, 1.5, 7]}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.2, 1.5, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 1.5, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 1.0, 0.4]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.5, 0.6, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      <mesh position={[0.5, 0.6, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.2, -0.3, 0]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0.2, -0.3, 0]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
    </group>
  );
}

function Scene({ selectedLocation, setSelectedLocation, unlockedAreas }: any) {
  return (
    <>
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} />
      
      <Mountain />

      {/* Black shadow route path curved around the mountain */}
      <Line 
        points={LINE_POINTS} 
        color="#1e293b" 
        lineWidth={8} 
        dashed={true} 
        dashSize={0.5} 
        gapSize={0.2} 
      />
      
      {MAP_LOCATIONS.map((loc) => {
        const isUnlocked = unlockedAreas.includes(loc.id);
        const isSelected = selectedLocation?.id === loc.id;
        
        return (
          <group key={loc.id} position={new THREE.Vector3(...loc.pos)}>
            {/* Marker */}
            <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); if (isUnlocked) setSelectedLocation(loc); }}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color={isUnlocked ? (isSelected ? "#38bdf8" : "#22c55e") : "#94a3b8"} />
            </mesh>
            
            {/* HTML Label */}
            <Html position={[0, 1.5, 0]} center className="pointer-events-none">
              <div className={`transition-all duration-300 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold shadow-lg
                ${isUnlocked 
                  ? (isSelected ? 'bg-sky-500 text-white scale-110' : 'bg-white text-green-600 border-2 border-green-200')
                  : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                }
              `}>
                {isUnlocked ? loc.name : `🔒 Complete previous level`}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

export function EcoMap({ forceFullscreen = false, isActive = true }: { forceFullscreen?: boolean, isActive?: boolean }) {
  const { xp, lifetimeXp, unlockedAreas } = useStore();
  const [selectedLocation, setSelectedLocation] = useState<typeof MAP_LOCATIONS[0] | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenChallenges, setShowFullscreenChallenges] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const currentLifetime = lifetimeXp ?? xp; // Fallback for migration
  
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "200px" });

  const handleZoom = (deltaY: number) => {
    const el = document.querySelector('#eco-map-canvas canvas');
    if (el) el.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true }));
  };

  const isEffectivelyFullscreen = isFullscreen || forceFullscreen;

  useEffect(() => {
    if (isEffectivelyFullscreen && isActive) {
      document.body.style.overflow = 'hidden';
      setIsFocused(true);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEffectivelyFullscreen, isActive]);


  return (
    <div 
      ref={ref} 
      onMouseLeave={() => !isEffectivelyFullscreen && setIsFocused(false)}
      className={`${isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : forceFullscreen ? 'w-full h-full rounded-none' : 'h-125 md:h-150 relative rounded-[3rem]'} w-full overflow-hidden border-4 border-sky-300 shadow-[0_10px_40px_-10px_rgba(56,189,248,0.5)] bg-sky-200 transition-all duration-500`}
    >
      <div className={`absolute inset-0 transition-opacity duration-300 ${showFullscreenChallenges ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Click to Interact Overlay to prevent scroll hijacking */}
      {!isFocused && !isFullscreen && (
        <div 
          className="absolute inset-0 z-30 bg-black/5 flex items-center justify-center cursor-pointer backdrop-blur-[1px] hover:bg-black/10 transition-colors"
          onClick={() => setIsFocused(true)}
        >
          <div className="bg-white/95 px-8 py-4 rounded-full font-bold text-sky-700 shadow-xl border-2 border-sky-200 flex items-center gap-3">
            <Navigation className="w-5 h-5 text-sky-500" />
            Click to interact with the map
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div className={`absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-lg border-2 border-sky-100 transition-opacity ${isFocused || isFullscreen ? 'opacity-100' : 'opacity-0'}`}>
        <Navigation className="w-6 h-6 text-sky-500 animate-bounce" />
        <span className="font-bold text-sky-700 text-lg">Drag to rotate the 3D map! 🗺️</span>
      </div>

      {/* EP HUD in Fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3"
          >
            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              <span className="font-black text-3xl text-emerald-800">EP: {xp}</span>
            </div>
            <button 
              onClick={() => setShowFullscreenChallenges(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1 active:scale-95 border border-emerald-400 flex items-center gap-2"
            >
              Earn More Energy Points ➔
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom & Fullscreen Controls */}
      <div className={`absolute bottom-6 right-6 z-20 flex flex-col gap-3 transition-opacity ${isFocused || isFullscreen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-2 border-sky-200 overflow-hidden">
          <button 
            onClick={() => handleZoom(-200)}
            className="p-3 hover:bg-sky-100 text-sky-700 transition-colors border-b border-sky-100"
            title="Zoom In"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button 
            onClick={() => handleZoom(200)}
            className="p-3 hover:bg-sky-100 text-sky-700 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-6 h-6" />
          </button>
        </div>
        
        {!forceFullscreen && (
          <button 
            onClick={() => {
              if (isFullscreen) {
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
              setIsFullscreen(!isFullscreen);
            }}
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-2 border-sky-200 hover:bg-sky-100 text-sky-700 transition-all hover:scale-105 active:scale-95"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
        )}
      </div>

      <div id="eco-map-canvas" className="w-full h-full">
        {isInView && (
          <Canvas shadows camera={{ position: [0, 8, 20], fov: 50 }}>
            <OrbitControls 
              enablePan={false} 
              minDistance={10} 
              maxDistance={30} 
              maxPolarAngle={Math.PI / 2 + 0.1}
              enableZoom={isFocused || isFullscreen} // Prevent scroll hijack
            />
            <Scene selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} unlockedAreas={unlockedAreas} />
            <Player lifetimeXp={currentLifetime} />
          </Canvas>
        )}
      </div>

      {/* Selected Location Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white p-6 rounded-4xl w-[90%] max-w-md border-4 border-sky-300 shadow-2xl ${isFullscreen ? 'bottom-12' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-extrabold text-sky-600 flex items-center gap-3">
                <span className="p-2 bg-sky-100 rounded-full">{selectedLocation.icon}</span> {selectedLocation.name}
              </h3>
              <button onClick={() => setSelectedLocation(null)} className="text-sky-300 hover:text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">✕</button>
            </div>
            <p className="text-sky-800 font-medium text-base mb-6 leading-relaxed">{selectedLocation.description}</p>
            <button 
              onClick={() => {
                setActiveLevel(selectedLocation.id);
                setSelectedLocation(null);
              }}
              className="w-full py-4 bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-extrabold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
            >
              Let's Go! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2D Minigame Overlay */}
      <AnimatePresence>
        {activeLevel && (
          <RestorationLevel 
            levelId={activeLevel} 
            onClose={() => setActiveLevel(null)} 
            onNextLevel={(nextId) => {
              setActiveLevel(nextId);
            }}
          />
        )}
      </AnimatePresence>
      </div>

      {/* Fullscreen Challenges Overlay */}
      <AnimatePresence>
        {showFullscreenChallenges && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] bg-[#022c22] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-[#022c22]/90 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center shadow-md">
              <button 
                onClick={() => setShowFullscreenChallenges(false)}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors border border-emerald-500/30 active:scale-95"
              >
                ← Back to Eco Map
              </button>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-emerald-100">{xp} EP</span>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto p-6 pt-10 pb-20">
               <Challenges />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
