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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full -translate-y-4">

        {/* Logo Section */}
        <div className="mb-6 flex flex-col items-center animate-fade-in-up">
          <div className="w-32 h-32 bg-primary flex items-center justify-center mb-6 rounded-[32px] shadow-[0px_12px_32px_rgba(0,89,187,0.3)]">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1", fontSize: '80px' }}>
              print
            </span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            PrinTM
          </h1>
        </div>

        {/* Minimal Loader */}
        <div className="mt-8 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Starting up...
          </p>
        </div>
      </div>

      {/* Bottom Attribution */}
      <div className="absolute bottom-8 left-0 w-full text-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
          Campus Integrated
        </p>
      </div>
    </div>
  );
}
