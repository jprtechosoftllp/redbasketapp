"use client"

import React, { useState, useEffect } from 'react';

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [loadingText, setLoadingText] = useState<string>('Initializing');

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const textStages = [
      { text: 'Initializing', at: 0 },
      { text: 'Loading Resources', at: 25 },
      { text: 'Building Components', at: 50 },
      { text: 'Finalizing', at: 75 },
      { text: 'Almost Ready', at: 90 },
      { text: 'Complete', at: 100 }
    ];

    const textInterval = setInterval(() => {
      const currentStage = textStages.reduce((acc, stage) => {
        return progress >= stage.at ? stage : acc;
      }, textStages[0]);
      setLoadingText(currentStage.text);
    }, 100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [progress]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 text-center px-6">
        {/* Logo/Icon Area with Pulse Animation */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse opacity-30"></div>
            
            {/* Middle Ring - Spinning */}
            <div className="absolute inset-2 border-t-4 border-r-4 border-purple-400 rounded-full animate-spin"></div>
            
            {/* Inner Circle with Gradient */}
            <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <div className="w-12 h-12 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Loading
          </span>
        </h1>

        {/* Dynamic Status Text */}
        <p className="text-purple-200 text-lg mb-8 animate-pulse">
          {loadingText}
          <span className="inline-block animate-bounce ml-1">.</span>
          <span className="inline-block animate-bounce animation-delay-200 ml-0.5">.</span>
          <span className="inline-block animate-bounce animation-delay-400 ml-0.5">.</span>
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md mx-auto mb-4">
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/30">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <p className="text-purple-300 text-sm mt-2 font-mono">{progress}%</p>
        </div>

        {/* Spinner Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(0);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;