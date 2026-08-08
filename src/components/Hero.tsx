"use client";
import { useState, useEffect, useRef } from 'react';

import { Canvas } from '@react-three/fiber';
import { Earth } from './Earth';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "200px" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] opacity-80" />
      
      {/* 3D Canvas Background */}
      {isInView && (
        <div className="absolute inset-0 z-0 opacity-60">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Earth />
          </Canvas>
        </div>
      )}

      {/* Floating Particles/Leaves (Simplified CSS animation for now) */}
      {isMounted && isInView && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-500/30"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: -50,
              rotate: 0 
            }}
            animate={{ 
              y: "110vh",
              rotate: 360,
              x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          >
            <Leaf size={24 + Math.random() * 24} />
          </motion.div>
        ))}
      </div>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-poppins font-bold text-white mb-6 leading-tight tracking-tight"
        >
          Small Habits. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
            Big Impact.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-4 text-xl md:text-2xl text-emerald-100/80 max-w-2xl mb-10 font-light"
        >
          Track your carbon footprint, complete eco challenges, and build a greener future.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          {!session && (
            <Link href="/login">
              <button className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </button>
            </Link>
          )}
          
          <button 
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-full transition-all border border-white/20 hover:border-emerald-400/50 flex items-center justify-center"
          >
            Calculate My Footprint
          </button>
        </motion.div>
      </div>
    </section>
  );
}
