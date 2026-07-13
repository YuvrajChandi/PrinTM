import React from 'react';

export default function MobileFrame({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-6 px-4">
      {/* Phone container */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-background shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-slate-900 rounded-[50px] overflow-hidden flex flex-col sm:max-w-[390px] sm:h-[844px] max-sm:h-screen max-sm:w-screen max-sm:max-w-none max-sm:border-0 max-sm:rounded-none">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3.5 pointer-events-none max-sm:hidden">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-850"></div>
        </div>

        {/* Status Bar */}
        <div className="sticky top-0 bg-background h-10 px-6 pt-2 flex justify-between items-center z-40 text-xs font-semibold text-on-surface select-none max-sm:h-12 max-sm:px-4">
          <div>9:41</div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">battery_5_bar</span>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="sticky bottom-1.5 left-0 w-full flex justify-center z-40 pointer-events-none max-sm:bottom-2">
          <div className="w-32 h-1 bg-on-surface/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
