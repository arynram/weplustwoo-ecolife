"use client";

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Html, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin, TreePine, Sun, Wind, Lock, Navigation } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import RestorationLevel from './RestorationLevel';

const MAP_LOCATIONS = [
  { id: 'home', name: '🏡 Happy Village', pos: [7, 1, 7], icon: <MapPin />, reqXp: 0, description: 'Your cozy starting point! Learn fun eco habits here.' },
  { id: 'forest', name: '🌳 Magic Forest', pos: [-6, 3, 6], icon: <TreePine />, reqXp: 50, description: 'A wonderful green forest protected by your super eco powers!' },
  { id: 'solar', name: '☀️ Sunny City', pos: [-5, 6, -5], icon: <Sun />, reqXp: 150, description: 'A super cool city that gets all its energy from the bright sun!' },
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

    // Add a simple walking bounce animation if moving or just a slight breathe
    const time = state.clock.getElapsedTime();
    ref.current.position.y += Math.sin(time * 5) * 0.1;
  });

  return (
    <group ref={ref} scale={0.4} position={[7, 1.5, 7]}>
      {/* Head (Bigger for a boy-like proportion) */}
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
      
      {/* Legs (Shorter) */}
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
                {isUnlocked ? loc.name : `🔒 Need ${loc.reqXp} EP`}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

export function EcoMap() {
  const { xp, lifetimeXp, unlockedAreas, unlockArea } = useStore();
  const [selectedLocation, setSelectedLocation] = useState<typeof MAP_LOCATIONS[0] | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  
  const currentLifetime = lifetimeXp ?? xp; // Fallback for migration
  
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "200px" });

  // Check and unlock areas based on EP
  useEffect(() => {
    MAP_LOCATIONS.forEach(loc => {
      if (currentLifetime >= loc.reqXp && !unlockedAreas.includes(loc.id)) {
        unlockArea(loc.id);
      }
    });
  }, [currentLifetime, unlockedAreas, unlockArea]);

  return (
    <div ref={ref} className="w-full h-125 md:h-150 relative rounded-[3rem] overflow-hidden border-4 border-sky-300 shadow-[0_10px_40px_-10px_rgba(56,189,248,0.5)] bg-sky-200">
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-lg border-2 border-sky-100">
        <Navigation className="w-6 h-6 text-sky-500 animate-bounce" />
        <span className="font-bold text-sky-700 text-lg">Drag to rotate the 3D map! 🗺️</span>
      </div>

      {isInView && (
        <Canvas shadows camera={{ position: [0, 8, 20], fov: 50 }}>
          <OrbitControls enablePan={false} minDistance={10} maxDistance={30} maxPolarAngle={Math.PI / 2 + 0.1} />
          <Scene selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} unlockedAreas={unlockedAreas} />
          <Player lifetimeXp={currentLifetime} />
        </Canvas>
      )}

      {/* Selected Location Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white p-6 rounded-4xl w-[90%] max-w-md border-4 border-sky-300 shadow-2xl"
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
  );
}
