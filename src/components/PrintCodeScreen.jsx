import React, { useState } from 'react';
import Header from './Header';
import { QRCodeSVG } from 'qrcode.react';

export default function PrintCodeScreen({ 
  printCode = "PM-7284", 
  onClose,
  onNavigateTab
}) {
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} showBackButton={true} onBack={onClose} title="Print Code" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm flex flex-col items-center">
          
          {/* QR Code Card */}
          <div className="bg-surface-container-highest p-5 shadow-[0px_4px_24px_rgba(0,89,187,0.06)] border border-outline-variant/30 mb-8 aspect-square w-60 flex items-center justify-center relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br from-surface-container-highest to-surface-container-lowest"></div>
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-105 bg-white p-2 rounded-md">
              <QRCodeSVG 
                value={printCode}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#0059bb"}
                level={"M"}
              />
            </div>
          </div>

          {/* Manual Entry Code Card */}
          <div className="w-full bg-surface-container-highest/70 backdrop-blur-sm border border-outline-variant/30 p-5 flex flex-col items-center mb-6 rounded-2xl shadow-sm">
            <span className="text-on-surface-variant text-xs font-bold tracking-[0.2em] mb-2 uppercase">Manual Entry Code</span>
            <div className="font-mono text-4xl font-black text-primary tracking-wider select-all">{printCode}</div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full mb-6 select-none">
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span className="text-secondary font-bold text-xs tracking-wider uppercase">READY TO PRINT</span>
          </div>

          {/* Hint Text */}
          <p className="text-on-surface-variant text-center text-sm leading-relaxed max-w-[240px] mb-10 font-medium">
            Scan this QR at the kiosk or enter the code manually.
          </p>

          {/* Action Button with micro-interaction */}
          <button 
            onClick={handleSave}
            disabled={saveStatus !== 'idle'}
            className={`flex items-center justify-center gap-3 w-full py-4 px-6 border-2 font-bold transition-all duration-200 shadow-sm rounded-md ${
              saveStatus === 'idle' 
                ? 'border-primary text-primary hover:bg-primary/5 active:scale-95' 
                : saveStatus === 'saving'
                  ? 'border-primary/50 text-primary/50 opacity-70 cursor-not-allowed'
                  : 'border-secondary text-secondary bg-surface-container-low'
            }`}
          >
            {saveStatus === 'idle' && (
              <>
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Save Code to Photos</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <span className="animate-spin material-symbols-outlined text-[20px]">sync</span>
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <span className="material-symbols-outlined text-[20px] text-secondary">check</span>
                <span>Saved!</span>
              </>
            )}
          </button>

        </div>
      </main>
    </div>
  );
}
