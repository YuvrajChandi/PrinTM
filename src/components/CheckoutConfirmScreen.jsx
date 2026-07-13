import React from 'react';
import Header from './Header';

export default function CheckoutConfirmScreen({
  selectedFiles,
  paymentMethod,
  onChangePaymentMethod,
  onBack,
  onConfirm,
  onNavigateTab
}) {
  // Per-file cost calculation
  const totalEstimatedCost = selectedFiles.reduce((acc, f) => {
    const rate = f.color === 'coloured' ? 10 : 3;
    return acc + (f.pages || 1) * (f.copies || 1) * rate;
  }, 0);
  const totalPages = selectedFiles.reduce((acc, f) => acc + (f.pages || 1), 0);
  const totalCopies = selectedFiles.reduce((acc, f) => acc + (f.copies || 1), 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} showBackButton={true} onBack={onBack} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 pb-36 flex flex-col gap-6">
        
        {/* Per-file summaries */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Document Settings</h3>
          
          {selectedFiles.map((file, idx) => {
            const rate = file.color === 'coloured' ? 10 : 3;
            const fileCost = (file.pages || 1) * (file.copies || 1) * rate;
            return (
              <div key={idx} className="bg-surface-container-lowest p-4 border border-outline-variant/30 shadow-sm rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-on-surface truncate">{file.name}</h4>
                    <p className="text-[11px] text-on-surface-variant">{file.pages} pages · {file.size}</p>
                  </div>
                  <span className="font-extrabold text-primary text-sm">₹{fileCost.toFixed(0)}</span>
                </div>

                {/* Settings chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-lg text-[11px] font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    {file.copies || 1} {(file.copies || 1) === 1 ? 'copy' : 'copies'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-lg text-[11px] font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px]">palette</span>
                    {file.color === 'coloured' ? 'Colour' : 'B&W'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-lg text-[11px] font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px]">crop_portrait</span>
                    {file.orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                  </span>
                  {file.duplex && (
                    <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-lg text-[11px] font-semibold text-on-surface-variant">
                      <span className="material-symbols-outlined text-[13px]">flip</span>
                      Duplex
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* Total Cost Card */}
        <section className="bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-sm rounded-2xl">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Total documents</span>
              <span className="font-semibold text-on-surface">{selectedFiles.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Total pages</span>
              <span className="font-semibold text-on-surface">{totalPages}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Paper size</span>
              <span className="font-semibold text-on-surface">A4</span>
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant/30 my-4"></div>

          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Estimated Cost</span>
            <span className="text-2xl font-black text-primary">₹{totalEstimatedCost.toFixed(2)}</span>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-on-surface ml-1">How would you like to pay?</h3>
          <div className="flex flex-col gap-3">
            
            {/* Pay via UPI */}
            <label className="block cursor-pointer group">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'upi'}
                onChange={() => onChangePaymentMethod('upi')}
                className="hidden" 
              />
              <div className={`flex items-start gap-4 p-4 border rounded-2xl transition-all duration-200 ${
                paymentMethod === 'upi'
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/45'
              }`}>
                <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  paymentMethod === 'upi' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                </div>
                <div className="flex-grow min-w-0 pr-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-on-surface text-sm">Pay via UPI</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi' ? 'border-primary' : 'border-outline-variant/50'
                    }`}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-tight">Pay now using any UPI app</p>
                </div>
              </div>
            </label>

            {/* Pay at Kiosk */}
            <label className="block cursor-pointer group">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'kiosk'}
                onChange={() => onChangePaymentMethod('kiosk')}
                className="hidden" 
              />
              <div className={`flex items-start gap-4 p-4 border rounded-2xl transition-all duration-200 ${
                paymentMethod === 'kiosk'
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/45'
              }`}>
                <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  paymentMethod === 'kiosk' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-[22px]">print</span>
                </div>
                <div className="flex-grow min-w-0 pr-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-on-surface text-sm">Pay at Kiosk</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'kiosk' ? 'border-primary' : 'border-outline-variant/50'
                    }`}>
                      {paymentMethod === 'kiosk' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-tight">Pay when you collect your prints at the kiosk</p>
                </div>
              </div>
            </label>

          </div>
        </section>

      </main>

      {/* Bottom Action Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-surface-container-lowest border-t border-outline-variant/30 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={onConfirm}
          className="w-full h-14 bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-2xl"
        >
          <span>Generate Print Code</span>
          <span className="material-symbols-outlined text-[20px]">qr_code</span>
        </button>
      </div>
    </div>
  );
}
