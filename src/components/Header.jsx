import React from 'react';

export default function Header({ 
  showBackButton = false, 
  onBack 
}) {
  return (
    <header className="w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between h-16 px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="material-symbols-outlined text-primary hover:bg-slate-100 dark:hover:bg-slate-800 p-2 -ml-2 rounded-full active:scale-95 transition-all mr-1"
          >
            arrow_back
          </button>
        )}
        <span className="material-symbols-outlined text-primary font-bold" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>
          print
        </span>
        <h1 className="text-headline-md font-bold text-primary tracking-tight">PrinTM</h1>
      </div>
    </header>
  );
}
