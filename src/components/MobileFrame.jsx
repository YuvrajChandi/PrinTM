import React from 'react';

export default function MobileFrame({ children }) {
  return (
    <div className="w-full min-h-[100dvh] bg-background sm:bg-slate-950 flex items-center justify-center sm:py-6 sm:px-4">
      {/* Container: 100% full-screen on mobile, elegant centered mobile viewport on desktop */}
      <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[412px] bg-background sm:shadow-2xl sm:border sm:border-slate-800 sm:rounded-[36px] overflow-hidden flex flex-col relative">
        {/* Screen Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
