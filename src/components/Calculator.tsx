"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Droplet, ShoppingBag, Utensils, CheckCircle, ArrowRight } from 'lucide-react';

export function Calculator() {
  const [step, setStep] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);

  const [answers, setAnswers] = useState({
    transport: 10,
    electricity: 5,
    diet: 'mixed',
    plastic: 'moderate'
  });

  const calculateFootprint = () => {
    // Dummy footprint calculation logic
    let footprint = 0;
    footprint += answers.transport * 0.2;
    footprint += answers.electricity * 0.5;
    footprint += answers.diet === 'vegan' ? 2 : answers.diet === 'vegetarian' ? 3 : 5;
    footprint += answers.plastic === 'none' ? 0 : answers.plastic === 'low' ? 1 : 3;

    setIsCalculated(true);
  };

  const steps = [
    {
      title: "How many kilometers do you travel daily by car?",
      icon: <Car className="w-8 h-8 text-emerald-400 mb-4" />,
      content: (
        <div className="w-full">
          <input 
            type="range" 
            min="0" max="100" 
            value={answers.transport} 
            onChange={(e) => setAnswers({...answers, transport: parseInt(e.target.value)})}
            className="w-full accent-emerald-500"
          />
          <div className="text-center mt-4 text-2xl font-bold text-emerald-300">{answers.transport} km</div>
        </div>
      )
    },
    {
      title: "What is your daily electricity usage? (kWh)",
      icon: <Zap className="w-8 h-8 text-yellow-400 mb-4" />,
      content: (
        <div className="w-full">
          <input 
            type="range" 
            min="0" max="50" 
            value={answers.electricity} 
            onChange={(e) => setAnswers({...answers, electricity: parseInt(e.target.value)})}
            className="w-full accent-yellow-500"
          />
          <div className="text-center mt-4 text-2xl font-bold text-yellow-300">{answers.electricity} kWh</div>
        </div>
      )
    },
    {
      title: "What best describes your diet?",
      icon: <Utensils className="w-8 h-8 text-orange-400 mb-4" />,
      content: (
        <div className="flex flex-col gap-3">
          {['vegan', 'vegetarian', 'mixed', 'meat-heavy'].map((diet) => (
            <button 
              key={diet}
              onClick={() => setAnswers({...answers, diet})}
              className={`w-full p-4 rounded-xl border transition-all ${answers.diet === diet ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10 glass hover:bg-white/5'}`}
            >
              {diet.charAt(0).toUpperCase() + diet.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "How much single-use plastic do you use?",
      icon: <ShoppingBag className="w-8 h-8 text-blue-400 mb-4" />,
      content: (
        <div className="flex flex-col gap-3">
          {['none', 'low', 'moderate', 'high'].map((level) => (
            <button 
              key={level}
              onClick={() => setAnswers({...answers, plastic: level})}
              className={`w-full p-4 rounded-xl border transition-all ${answers.plastic === level ? 'border-blue-400 bg-blue-500/20' : 'border-white/10 glass hover:bg-white/5'}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto glass-dark p-8 md:p-12 rounded-3xl relative overflow-hidden">
      {!isCalculated ? (
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">Step {step + 1} of {steps.length}</h3>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full transition-all ${i <= step ? 'bg-emerald-400' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
          
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center min-h-62.5"
          >
            {steps[step].icon}
            <h4 className="text-xl md:text-2xl text-center font-medium mb-8 text-emerald-50">{steps[step].title}</h4>
            {steps[step].content}
          </motion.div>
          
          <div className="flex justify-between mt-12">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`px-6 py-3 rounded-full font-medium transition-all ${step === 0 ? 'opacity-50 cursor-not-allowed text-white/50' : 'text-white glass hover:bg-white/10'}`}
            >
              Back
            </button>
            <button 
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  calculateFootprint();
                }
              }}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
            >
              {step === steps.length - 1 ? 'Calculate' : 'Next'}
              {step !== steps.length - 1 && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center py-8"
        >
          <div className="w-32 h-32 rounded-full border-4 border-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-emerald-500/10">
            <span className="text-4xl font-bold text-emerald-300">
              {(answers.transport * 0.2 + answers.electricity * 0.5 + (answers.diet === 'vegan' ? 2 : 5)).toFixed(1)}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">kg CO₂e / day</h3>
          <p className="text-emerald-100/80 mb-8 max-w-md">Your carbon footprint has been calculated. Use this information to find areas where you can reduce your impact!</p>
          
          <button 
            onClick={() => {
              setIsCalculated(false);
              setStep(0);
            }}
            className="px-8 py-3 glass hover:bg-white/10 text-white font-bold rounded-full transition-all"
          >
            Recalculate
          </button>
        </motion.div>
      )}
    </div>
  );
}
