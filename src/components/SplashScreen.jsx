import React, { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 bg-surface text-on-surface flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-80 bg-surface-container-highest shadow-[0px_4px_12px_rgba(15,23,42,0.03)] rotate-12 rounded-xl opacity-40"></div>
        <div className="absolute bottom-[-15%] left-[-5%] w-72 h-96 bg-surface-container-highest shadow-[0px_4px_12px_rgba(15,23,42,0.03)] -rotate-6 rounded-xl opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-sm w-full -translate-y-10">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="w-20 h-20 bg-primary flex items-center justify-center mb-4 shadow-lg rounded-[22px] transform hover:rotate-3 active:scale-95 transition-transform duration-500">
            <span className="material-symbols-outlined text-[40px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              print
            </span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            PrintM
          </h1>
        </div>

        {/* Greeting Section */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <p className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
            Ready to print?
          </p>
          <p className="text-sm text-on-surface-variant max-w-[240px] mx-auto leading-relaxed">
            Setting up your academic workspace...
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <div className="loading-bar-container mb-3">
            <div className="loading-bar-fill"></div>
          </div>
          <p className="text-xs font-bold text-outline uppercase tracking-widest animate-pulse-slow">
            Syncing Files
          </p>
        </div>
      </div>

      {/* Bottom Attribution */}
      <div className="absolute bottom-8 left-0 w-full text-center animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
        <div className="flex items-center justify-center space-x-2">
          <span className="material-symbols-outlined text-[18px] text-outline">school</span>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Campus Integrated</span>
        </div>
      </div>
    </div>
  );
}
