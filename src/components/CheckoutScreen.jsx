import React, { useRef, useState, useEffect, useCallback } from 'react';
import Header from './Header';
import { MockApi } from '../services/mockApi';

const resolvePreviewUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  return `${apiBase}${url}`;
};

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
  const [isUploading, setIsUploading] = useState(false);
  const prevLengthRef = useRef(selectedFiles.length);

  const touchStartPos = useRef(null);
  const touchStartIndex = useRef(null);
  const isTouchSwiping = useRef(false);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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
  const handleAddFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
            const data = await MockApi.uploadFile(file);
            onAddFile({
              fileId: data.fileId,
              name: data.fileName,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              pages: data.pageCount,
              previewUrl: data.previewUrl
            });
          } else {
            alert("Only PDF files are supported!");
          }
        }
      } catch (err) {
        alert("Upload failed: " + err.message);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const triggerAddFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

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

  // Scroll handler — detect which card is centered without thrashing state
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
    if (closest !== activeIndexRef.current && closest < selectedFiles.length) {
      activeIndexRef.current = closest;
      setActiveIndex(closest);
    }
  }, [selectedFiles.length]);

  // Touch gesture listeners to enforce single-step carousel swipe on mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartIndex.current = activeIndexRef.current;
      isTouchSwiping.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!isTouchSwiping.current || !touchStartPos.current) return;
    isTouchSwiping.current = false;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : 0;
    const endY = e.changedTouches ? e.changedTouches[0].clientY : 0;
    const deltaX = endX - touchStartPos.current.x;
    const deltaY = endY - touchStartPos.current.y;

    // Trigger only if horizontal swipe exceeds 35px threshold and is more horizontal than vertical
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      const startIdx = touchStartIndex.current ?? activeIndexRef.current;
      const maxIdx = selectedFiles.length; // up to Add Files card
      let targetIdx = startIdx;

      if (deltaX < -35) {
        // Swiped left -> advance by 1 card max
        targetIdx = Math.min(maxIdx, startIdx + 1);
      } else if (deltaX > 35) {
        // Swiped right -> go back by 1 card max
        targetIdx = Math.max(0, startIdx - 1);
      }

      if (targetIdx !== startIdx) {
        if (targetIdx < selectedFiles.length) {
          setActiveIndex(targetIdx);
        }
        scrollToIndex(targetIdx);
      }
    }
    touchStartPos.current = null;
    touchStartIndex.current = null;
  };

  // Tap on a non-active card to scroll to it
  const handleCardTap = (idx) => {
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      scrollToIndex(idx);
    }
  };

  // Auto-focus on new files, or handle deletions
  useEffect(() => {
    if (selectedFiles.length > prevLengthRef.current) {
      // New files added! Focus on the first newly added file.
      const newIndex = prevLengthRef.current;
      setActiveIndex(newIndex);
      // Small timeout ensures the DOM has updated layout for the new cards before scrolling
      setTimeout(() => scrollToIndex(newIndex), 50);
    } else if (activeIndex >= selectedFiles.length && selectedFiles.length > 0) {
      // File deleted, keep activeIndex in bounds
      setActiveIndex(selectedFiles.length - 1);
    }
    prevLengthRef.current = selectedFiles.length;
  }, [selectedFiles.length, activeIndex, scrollToIndex]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} showBackButton={true} onBack={onBack} title="Checkout" />

      {/* Main Form Content */}
      <main className="flex-1 overflow-y-auto pb-8 flex flex-col gap-5">

        {/* ─── Document Carousel ─── */}
        <section className="pt-4">
          <div className="mb-3 px-5 flex items-center justify-between">
            <h2 className="section-label">Documents ({selectedFiles.length})</h2>

            {selectedFiles.length > 1 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <span>{activeIndex + 1} of {selectedFiles.length}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeIndex > 0) {
                        const prev = activeIndex - 1;
                        setActiveIndex(prev);
                        scrollToIndex(prev);
                      }
                    }}
                    disabled={activeIndex === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all text-on-surface"
                    title="Previous document"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeIndex < selectedFiles.length - 1) {
                        const next = activeIndex + 1;
                        setActiveIndex(next);
                        scrollToIndex(next);
                      }
                    }}
                    disabled={activeIndex >= selectedFiles.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all text-on-surface"
                    title="Next document"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
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

          <div
            ref={carouselRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex overflow-x-auto no-scrollbar gap-5 py-3 snap-x snap-mandatory carousel-track"
          >
            {/* Left Spacer to center the first card */}
            <div className="w-[calc(50%-105px)] flex-shrink-0" />
            {selectedFiles.map((file, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  data-file-index={idx}
                  onClick={() => handleCardTap(idx)}
                  className="flex flex-col items-center flex-shrink-0 snap-center snap-always carousel-card cursor-pointer select-none"
                >
                  {/* The Main Card: PDF Front-Page Preview */}
                  <div
                    className={`relative w-[210px] h-[280px] rounded-2xl overflow-hidden bg-white transition-all duration-300 ease-out ${
                      isActive
                        ? 'ring-4 ring-primary shadow-[0_12px_36px_rgba(0,89,187,0.3)] scale-100 z-10'
                        : 'scale-[0.92] opacity-65 border border-outline-variant/30 shadow-sm hover:opacity-85'
                    }`}
                  >
                    {/* Delete button */}
                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteFile(idx); }}
                        className="absolute top-2.5 right-2.5 bg-error text-white rounded-full p-1.5 shadow-md active:scale-90 transition-transform hover:bg-red-700 z-20"
                        title="Remove file"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    )}

                    {/* PDF Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded shadow-sm z-10 tracking-wider">
                      PDF
                    </div>

                    {/* Preview Image or Fallback */}
                    {file.previewUrl ? (
                      <img
                        src={resolvePreviewUrl(file.previewUrl)}
                        alt={file.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-low flex flex-col items-center justify-center p-4">
                        <span className="material-symbols-outlined text-[56px] text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>
                          description
                        </span>
                        <span className="text-xs font-bold text-on-surface-variant mt-2">PDF Document</span>
                      </div>
                    )}

                    {/* Active "Editing" Pill */}
                    {isActive && (
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white rounded-full px-3 py-1 text-[10px] font-bold shadow-md z-10 pointer-events-none uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[12px] text-primary-fixed">edit</span>
                        <span>Editing</span>
                      </div>
                    )}
                  </div>

                  {/* PDF Name and Size Details Shown Below */}
                  <div className="mt-3 flex flex-col items-center w-[210px] text-center px-1">
                    <span className={`font-bold truncate w-full ${isActive ? 'text-[14px] text-on-surface' : 'text-xs text-on-surface-variant'}`}>
                      {file.name}
                    </span>
                    <span className={`mt-0.5 ${isActive ? 'text-xs text-on-surface-variant font-medium' : 'text-[10px] text-outline'}`}>
                      {file.pages} pages · {file.size}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Add More Card */}
            <div
              data-file-index={selectedFiles.length}
              onClick={triggerAddFileSelect}
              className="flex flex-col items-center flex-shrink-0 snap-center snap-always carousel-card cursor-pointer select-none"
            >
              <button
                type="button"
                disabled={isUploading}
                className={`w-[210px] h-[280px] rounded-2xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center bg-surface-container-lowest transition-all duration-200 scale-[0.92] ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'active:scale-90 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="p-4 border-2 border-dashed border-outline-variant/40 rounded-full mb-3">
                  <span className={`material-symbols-outlined text-on-surface-variant text-[28px] ${isUploading ? 'animate-spin' : ''}`}>
                    {isUploading ? 'refresh' : 'add'}
                  </span>
                </div>
                <span className="font-bold text-on-surface-variant text-sm">
                  {isUploading ? 'Uploading...' : 'Add Files'}
                </span>
              </button>

              <div className="mt-3 flex flex-col items-center w-[210px] text-center px-1">
                <span className="font-semibold text-xs text-on-surface-variant">Add More</span>
                <span className="text-[10px] text-outline mt-0.5">Upload another PDF</span>
              </div>
            </div>

            {/* Right Spacer matching Left Spacer */}
            <div className="w-[calc(50%-105px)] flex-shrink-0" />
          </div>

          {/* Dot indicators */}
          {selectedFiles.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {selectedFiles.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setActiveIndex(idx); scrollToIndex(idx); }}
                  className={`rounded-full transition-all duration-300 ${idx === activeIndex
                      ? 'w-5 h-1.5 bg-primary'
                      : 'w-1.5 h-1.5 bg-outline-variant/40 hover:bg-outline-variant'
                    }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* ─── Settings for Active File ─── */}
        <div className="px-4 flex flex-col gap-4">

          {/* Copies Control */}
          <section className="bg-surface-container-lowest rounded-[40px] p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-on-surface px-1">Copies</h2>
            </div>
            <div className="flex items-center bg-secondary rounded-full px-3 py-2 gap-4 text-white select-none shadow-[0_2px_8px_rgba(0,107,95,0.2)]">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all"
                onClick={() => updateSetting('copies', Math.max(1, copies - 1))}
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="font-extrabold w-5 text-center text-[15px]">{copies}</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all"
                onClick={() => updateSetting('copies', copies + 1)}
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </section>

          {/* Print Settings */}
          <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-6">

            {/* Print Color */}
            <div>
              <h3 className="section-label mb-3">Print color</h3>
              <div className="grid grid-cols-2 gap-3">

                {/* Colored */}
                <button
                  type="button"
                  onClick={() => updateSetting('color', 'coloured')}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${color === 'coloured'
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
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${color === 'bw'
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
              <h3 className="section-label mb-3">Orientation</h3>
              <div className="grid grid-cols-2 gap-3">

                {/* Portrait */}
                <button
                  type="button"
                  onClick={() => updateSetting('orientation', 'portrait')}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${orientation === 'portrait'
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
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${orientation === 'landscape'
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
              <h3 className="section-label mb-3">Payment Method</h3>
              <div className="flex flex-col gap-3">
                {/* Pay at Kiosk */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kiosk')}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${paymentMethod === 'kiosk'
                      ? 'border-2 border-secondary bg-surface-container-highest shadow-sm'
                      : 'border border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'kiosk' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
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
                  className="flex items-center gap-3 p-3 rounded-2xl text-left border border-outline-variant/30 opacity-60 cursor-not-allowed bg-surface-container-lowest"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-highest text-on-surface-variant">
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

          {/* Inline Order Summary & Generate QR Section at bottom of page */}
          <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4 mt-1">
            <div className="flex items-center justify-between select-none">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface">Order Summary</span>
                <span className="text-xs text-on-surface-variant mt-0.5">
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'document' : 'documents'} · {totalPages} {totalPages === 1 ? 'page' : 'pages'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Estimated Total</span>
                <span className="font-extrabold text-xl text-primary">₹{totalEstimatedCost.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={onProceed}
              disabled={isProcessing || selectedFiles.length === 0}
              className="btn-primary w-full !h-12 shadow-md !rounded-2xl"
            >
              {isProcessing ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">qr_code</span>
              )}
              {isProcessing ? 'Generating...' : 'Generate Print QR'}
            </button>
          </section>

        </div>

      </main>
    </div>
  );
}
