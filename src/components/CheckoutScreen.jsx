import React, { useRef, useState, useEffect, useCallback } from 'react';
import Header from './Header';

export default function CheckoutScreen({
  selectedFiles,
  isProcessing,
  onDeleteFile,
  onAddFile,
  onUpdateFileSettings,
  onBack,
  onProceed,
  onNavigateTab
}) {
  const fileInputRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('kiosk'); // 'kiosk' | 'upi'

  // Keep activeIndex in bounds when files are deleted
  useEffect(() => {
    if (activeIndex >= selectedFiles.length && selectedFiles.length > 0) {
      setActiveIndex(selectedFiles.length - 1);
    }
  }, [selectedFiles.length, activeIndex]);

  // Current file & its settings
  const currentFile = selectedFiles[activeIndex] || selectedFiles[0];
  const copies = currentFile?.copies ?? 1;
  const color = currentFile?.color ?? 'bw';
  const orientation = currentFile?.orientation ?? 'portrait';
  const duplex = currentFile?.duplex ?? false;

  // Cost calculation — per-file sum
  const totalEstimatedCost = selectedFiles.reduce((acc, f) => {
    const rate = f.color === 'coloured' ? 10 : 3;
    return acc + (f.pages || 1) * (f.copies || 1) * rate;
  }, 0);
  const totalPages = selectedFiles.reduce((acc, f) => acc + (f.pages || 1), 0);

  // Setting updaters for the active file
  const updateSetting = useCallback((key, value) => {
    onUpdateFileSettings(activeIndex, { [key]: value });
  }, [activeIndex, onUpdateFileSettings]);

  // File add handler
  const handleAddFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
          onAddFile({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            pages: Math.floor(Math.random() * 8) + 2
          });
        } else {
          alert("Only PDF files are supported!");
        }
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerAddFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Scroll handler — detect which card is centered
  const handleScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      if (child.dataset.fileIndex === undefined) continue;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(containerCenter - childCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = parseInt(child.dataset.fileIndex, 10);
      }
    }
    if (closest !== activeIndex && closest < selectedFiles.length) {
      setActiveIndex(closest);
    }
  }, [activeIndex, selectedFiles.length]);

  // Scroll to a specific index
  const scrollToIndex = useCallback((idx) => {
    const container = carouselRef.current;
    if (!container) return;
    const child = container.querySelector(`[data-file-index="${idx}"]`);
    if (child) {
      const scrollLeft = child.offsetLeft - (container.offsetWidth / 2) + (child.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, []);

  // Tap on a non-active card to scroll to it
  const handleCardTap = (idx) => {
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      scrollToIndex(idx);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} showBackButton={true} onBack={onBack} />

      {/* Main Form Content */}
      <main className="flex-1 overflow-y-auto pb-48 flex flex-col gap-5">

        {/* ─── Document Carousel ─── */}
        <section className="pt-4">
          <div className="mb-3 px-5">
            <h2 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">Documents ({selectedFiles.length})</h2>
          </div>

          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAddFileChange}
            accept="application/pdf"
            multiple
            className="hidden"
          />

          {/* Scrollable carousel */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto no-scrollbar gap-3 py-3 px-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollPaddingInline: '16px' }}
          >
            {selectedFiles.map((file, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  data-file-index={idx}
                  onClick={() => handleCardTap(idx)}
                  className={`relative flex-shrink-0 snap-center flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out cursor-pointer ${isActive
                      ? 'w-[220px] h-[280px] bg-gradient-to-br from-primary to-[#00428c] text-white shadow-[0_8px_30px_rgba(0,89,187,0.3)] scale-100 z-10'
                      : 'w-[160px] h-[220px] bg-surface-container-lowest border border-outline-variant/30 text-on-surface opacity-60 scale-95'
                    }`}
                >
                  {/* Delete button */}
                  {isActive && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteFile(idx); }}
                      className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1.5 shadow-md active:scale-90 transition-transform hover:bg-red-700 z-20"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}

                  {/* PDF Icon */}
                  <div className={`rounded-xl mb-3 flex items-center justify-center ${isActive ? 'bg-white/15 p-5' : 'bg-primary/5 p-4'
                    }`}>
                    <span className={`material-symbols-outlined ${isActive ? 'text-[52px] text-white' : 'text-[40px] text-primary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      description
                    </span>
                  </div>

                  {/* File name */}
                  <span className={`text-center font-bold truncate w-full px-3 ${isActive ? 'text-[15px] text-white' : 'text-xs text-on-surface'
                    }`}>
                    {file.name}
                  </span>

                  {/* Meta info */}
                  <span className={`text-center mt-1 ${isActive ? 'text-xs text-white/70' : 'text-[10px] text-on-surface-variant'
                    }`}>
                    {file.pages} pages · {file.size}
                  </span>

                  {/* Active file badge */}
                  {isActive && (
                    <div className="mt-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="material-symbols-outlined text-[12px]">edit</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Editing</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add More Card */}
            <button
              onClick={triggerAddFileSelect}
              className="flex-shrink-0 snap-center bg-surface-container-lowest border-2 border-dashed border-outline-variant/40 rounded-2xl flex flex-col items-center justify-center w-[140px] h-[220px] transition-all active:scale-95 duration-150 opacity-80 hover:opacity-100"
            >
              <div className="p-3 border-2 border-dashed border-outline-variant/40 rounded-full mb-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[24px]">add</span>
              </div>
              <span className="font-bold text-on-surface-variant text-xs">Add Files</span>
            </button>
          </div>

          {/* Dot indicators */}
          {selectedFiles.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {selectedFiles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveIndex(idx); scrollToIndex(idx); }}
                  className={`rounded-full transition-all duration-300 ${idx === activeIndex
                      ? 'w-6 h-2 bg-primary'
                      : 'w-2 h-2 bg-outline-variant/40 hover:bg-outline-variant'
                    }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* ─── Settings for Active File ─── */}
        <div className="px-4 flex flex-col gap-4">

          {/* Copies Control */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[15px] text-on-surface">Copies</h2>
            </div>
            <div className="flex items-center bg-secondary rounded-full px-1 py-1 gap-3.5 text-white select-none shadow-[0_2px_8px_rgba(0,107,95,0.2)]">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all"
                onClick={() => updateSetting('copies', Math.max(1, copies - 1))}
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-extrabold w-4 text-center text-sm">{copies}</span>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all"
                onClick={() => updateSetting('copies', copies + 1)}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </section>

          {/* Print Settings */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-6">

            {/* Print Color */}
            <div>
              <h3 className="font-bold text-[13px] text-on-surface-variant mb-3 uppercase tracking-wider">Print color</h3>
              <div className="grid grid-cols-2 gap-3">

                {/* Colored */}
                <button
                  type="button"
                  onClick={() => updateSetting('color', 'coloured')}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${color === 'coloured'
                      ? 'border-2 border-secondary bg-surface-container-highest shadow-sm'
                      : 'border border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className="relative w-8 h-8 flex-shrink-0 select-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-cyan-400 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80"></div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">Coloured</p>
                    <p className="text-xs text-on-surface-variant">₹10/page</p>
                  </div>
                </button>

                {/* B&W */}
                <button
                  type="button"
                  onClick={() => updateSetting('color', 'bw')}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${color === 'bw'
                      ? 'border-2 border-secondary bg-surface-container-highest shadow-sm'
                      : 'border border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className="relative w-8 h-8 flex-shrink-0 select-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-slate-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-slate-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80"></div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">B & W</p>
                    <p className="text-xs text-on-surface-variant">₹3/page</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Orientation */}
            <div>
              <h3 className="font-bold text-[13px] text-on-surface-variant mb-3 uppercase tracking-wider">Orientation</h3>
              <div className="grid grid-cols-2 gap-3">

                {/* Portrait */}
                <button
                  type="button"
                  onClick={() => updateSetting('orientation', 'portrait')}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${orientation === 'portrait'
                      ? 'border-2 border-secondary bg-surface-container-highest shadow-sm'
                      : 'border border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className={`w-8 h-10 rounded flex items-center justify-center ${orientation === 'portrait' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      description
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">Portrait</p>
                    <p className="text-xs text-on-surface-variant">8.3 x 11.7 in</p>
                  </div>
                </button>

                {/* Landscape */}
                <button
                  type="button"
                  onClick={() => updateSetting('orientation', 'landscape')}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${orientation === 'landscape'
                      ? 'border-2 border-secondary bg-surface-container-highest shadow-sm'
                      : 'border border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className={`w-10 h-8 rounded flex items-center justify-center ${orientation === 'landscape' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1', transform: 'rotate(90deg)'" }}>
                      description
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">Landscape</p>
                    <p className="text-xs text-on-surface-variant">11.7 x 8.3 in</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Double-side Switch */}
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              <span className="font-bold text-sm text-on-surface-variant">Double side printing</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={duplex}
                  onChange={(e) => updateSetting('duplex', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            {/* Payment Method */}
            <div className="pt-4 border-t border-outline-variant/30">
              <h3 className="font-bold text-[13px] text-on-surface-variant mb-3 uppercase tracking-wider">Payment Method</h3>
              <div className="flex flex-col gap-3">
                {/* Pay at Kiosk */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kiosk')}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${paymentMethod === 'kiosk'
                      ? 'border-2 border-secondary bg-surface-container-highest shadow-sm'
                      : 'border border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'kiosk' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface">Pay at Kiosk</p>
                    <p className="text-xs text-on-surface-variant">Pay using UPI scanner at the printer</p>
                  </div>
                  {paymentMethod === 'kiosk' && (
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>

                {/* Pay using UPI (Disabled) */}
                <button
                  type="button"
                  disabled={true}
                  className="flex items-center gap-3 p-3 rounded-xl text-left border border-outline-variant/30 opacity-60 cursor-not-allowed bg-surface-container-lowest"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-highest text-on-surface-variant">
                    <span className="material-symbols-outlined text-[24px]">phone_iphone</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface">Pay using UPI</p>
                    <p className="text-xs text-on-surface-variant text-rose-500 font-medium">Coming soon</p>
                  </div>
                </button>
              </div>
            </div>

          </section>
        </div>

      </main>

      {/* Floating Bottom action sheet */}
      <div className="absolute bottom-0 w-full p-4 bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col gap-3 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.03)]">

        {/* Order Summary */}
        <div className="bg-surface-container-low p-3.5 border border-outline-variant/30 flex items-center justify-between rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-highest p-1.5 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            </div>
            <span className="font-bold text-on-surface text-sm">
              {selectedFiles.length} {selectedFiles.length === 1 ? 'doc' : 'docs'}, {totalPages} {totalPages === 1 ? 'page' : 'pages'}
            </span>
          </div>
          <div>
            <span className="font-extrabold text-lg text-primary">₹{totalEstimatedCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onProceed}
          disabled={selectedFiles.length === 0 || isProcessing}
          className={`w-full h-14 bg-primary text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${selectedFiles.length === 0 || isProcessing ? 'opacity-50 cursor-not-allowed' : 'shadow-lg shadow-primary/20'
            }`}
        >
          {isProcessing ? 'Generating...' : 'Generate Print QR'}
          <span className={`material-symbols-outlined text-[18px] ${isProcessing ? 'animate-spin' : ''}`}>
            {isProcessing ? 'refresh' : 'qr_code'}
          </span>
        </button>

      </div>
    </div>
  );
}
