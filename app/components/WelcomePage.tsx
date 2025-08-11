'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WelcomePageProps {
  onComplete: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const welcomeSteps = [
    {
      title: "Welcome to Meme Generator Pro",
      subtitle: "Create viral memes with AI-powered tools",
      icon: "🎭"
    },
    {
      title: "AI Image Generation",
      subtitle: "Generate custom images with artificial intelligence",
      icon: "🤖"
    },
    {
      title: "Template Library",
      subtitle: "Access thousands of popular meme templates",
      icon: "📚"
    },
    {
      title: "Professional Tools",
      subtitle: "Advanced editing with fonts, colors, and effects",
      icon: "⚡"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < welcomeSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onComplete, 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete, welcomeSteps.length]);

  const skipWelcome = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-bg">
      <div className="absolute inset-0 gradient-bg-overlay" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-8 max-w-2xl mx-auto"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-6xl mb-4 float">🎭</div>
          <h1 className="text-4xl font-bold text-white mb-2 gradient-text">
            Meme Generator Pro
          </h1>
          <p className="text-zinc-200 text-lg">
            The ultimate meme creation experience
          </p>
        </motion.div>

        {/* Welcome Steps */}
        <div className="space-y-8">
          {welcomeSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0,
                scale: index === currentStep ? 1.05 : 1
              }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className={`p-6 rounded-2xl backdrop-blur-md transition-all duration-500 ${
                index === currentStep 
                  ? 'glass border-2 border-white/30 shadow-2xl' 
                  : 'glass-dark border border-white/10'
              }`}
            >
              <div className="flex items-center justify-center space-x-4">
                <motion.div
                  animate={{ 
                    rotate: index === currentStep ? [0, 10, -10, 0] : 0 
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: index === currentStep ? Infinity : 0,
                    repeatDelay: 2
                  }}
                  className="text-4xl"
                >
                  {step.icon}
                </motion.div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-zinc-300 text-sm">
                    {step.subtitle}
                  </p>
                </div>
              </div>
              
              {index === currentStep && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-4"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center space-x-2 mt-12"
        >
          {welcomeSteps.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                opacity: index <= currentStep ? 1 : 0.3
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </motion.div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={skipWelcome}
          className="mt-8 px-6 py-2 text-white/80 hover:text-white transition-colors duration-200 text-sm underline decoration-dashed underline-offset-4"
        >
          Skip Introduction
        </motion.button>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                scale: 0,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
                y: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) - 100
                ]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
