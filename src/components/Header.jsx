import React from 'react';

export default function Header({ 
  showBackButton = false, 
  onBack,
  title = "PrinTM"
}) {
  const isDefaultLogo = title === "PrinTM";
  return (
    <header className="w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between h-14 px-5 shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="material-symbols-outlined text-primary text-[22px] hover:bg-slate-100 dark:hover:bg-slate-800 w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:scale-95 transition-all duration-200 mr-1"
          >
            arrow_back
          </button>
        )}
        {isDefaultLogo && (
          <span className="material-symbols-outlined text-primary font-bold" style={{ fontVariationSettings: "'FILL' 1", fontSize: '26px' }}>
            print
          </span>
        )}
        <h1 className="text-lg font-bold text-primary tracking-tight">{title}</h1>
      </div>
    </header>
  );
}
