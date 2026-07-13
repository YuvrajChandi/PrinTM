import React, { useState } from 'react';
import Header from './Header';

export default function InfoScreen({ onNavigateTab }) {
  const [expandedFaq, setExpandedFaq] = useState(0); // Index of expanded FAQ, default first open

  const faqData = [
    {
      q: "What file types are supported?",
      a: "Currently, only PDF files are supported. Max size: 50 MB."
    },
    {
      q: "How long is my print code valid?",
      a: "Your code is valid for 24 hours. After that, the job is automatically cancelled and the file is deleted."
    },
    {
      q: "Can I cancel my order?",
      a: "Yes, you can cancel from the My Jobs screen as long as the job hasn't started printing."
    },
    {
      q: "Is my document secure?",
      a: "Yes. Your file is encrypted during upload and automatically deleted from our system after printing. No one at the kiosk can see your document."
    },
    {
      q: "Where can I find a PrintM kiosk?",
      a: "Kiosks are located at the Central Library, Student Centre, and Academic Block B. Look for the PrintM logo."
    },
    {
      q: "What payment methods are accepted?",
      a: "You can pay via UPI, cash, or card at the kiosk. Online UPI payment is also available from this app during the checkout process."
    }
  ];

  const toggleFaq = (idx) => {
    if (expandedFaq === idx) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(idx);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto py-6 px-6 pb-24 space-y-8">
        
        {/* Hero Section */}
        <section className="space-y-1">
          <h2 className="font-headline text-headline-sm font-bold text-primary">How PrintM Works</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">Streamline your academic printing with our simple 4-step process.</p>
        </section>

        {/* Steps Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          
          {/* Step 1 */}
          <div className="col-span-2 bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-primary-container text-primary rounded-lg flex items-center justify-center font-bold text-base select-none">1</div>
              <span className="material-symbols-outlined text-primary text-2xl opacity-30">upload_file</span>
            </div>
            <div>
              <h3 className="font-bold text-md mb-1 text-on-surface">Upload Your Document</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Choose a PDF from your device. Use Quick Print for common university documents like assignments or lecture notes.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-span-2 bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-primary-container text-primary rounded-lg flex items-center justify-center font-bold text-base select-none">2</div>
              <span className="material-symbols-outlined text-primary text-2xl opacity-30">settings</span>
            </div>
            <div>
              <h3 className="font-bold text-md mb-1 text-on-surface">Configure Print Settings</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Select color or B&W, copies, orientation, and duplex printing. See the cost update live.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-span-2 bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-primary-container text-primary rounded-lg flex items-center justify-center font-bold text-base select-none">3</div>
              <span className="material-symbols-outlined text-primary text-2xl opacity-30">qr_code_2</span>
            </div>
            <div>
              <h3 className="font-bold text-md mb-1 text-on-surface">Get Your Print Code</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Confirm your order and receive a QR code and a 6-digit numeric code. Pay via UPI or at the kiosk.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="col-span-2 bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-primary-container text-primary rounded-lg flex items-center justify-center font-bold text-base select-none">4</div>
              <span className="material-symbols-outlined text-primary text-2xl opacity-30">print</span>
            </div>
            <div>
              <h3 className="font-bold text-md mb-1 text-on-surface">Print at the Kiosk</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Scan your QR code at any PrintM kiosk. Collect prints; your file is automatically deleted after printing.</p>
            </div>
          </div>

        </section>

        {/* Kiosk Locations Graphic */}
        <section className="relative w-full h-44 overflow-hidden shadow-[0px_4px_16px_rgba(0,89,187,0.06)] rounded-2xl group border border-outline-variant/30">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent z-10"></div>
          <div className="absolute bottom-4 left-4 z-20 text-white select-none">
            <h4 class="font-bold text-sm">Find a Kiosk</h4>
            <p className="text-[10px] opacity-80 mt-0.5">Located at Library, Student Centre, and Academic Block B.</p>
          </div>
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgkYCuhFPIgM7xHpiqAEStn1kKR8Bp3Wb9SBxMvmHndoleC8nG73GYMXC_9W9Cewmf1w6gnYfeWHFR4e6nOEwYhLD8PAxy4EJQJyqqOPzLrIJwzblQf9pijea4yFD4qZNg-m0pIWFLnheqkz8HljgaoWvwH7L-kOOtQdsTO_UYoOLG8yETLl1wQ0L51sdOlOJFoN322cp3Kx5TZmz7OTAXBWbrBcnXGHBccw_oXAHWDD2Q6KH88pUm9TgMp90m5tYu7FFBolH6WIOH"
            alt="Kiosk Locations Map"
          />
        </section>

        {/* FAQ Accordion Section */}
        <section className="flex flex-col gap-4">
          <h2 className="font-headline text-headline-sm font-bold text-primary">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-2.5">
            {faqData.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`overflow-hidden transition-all duration-200 rounded-2xl border ${
                    isExpanded 
                      ? 'bg-surface-container-low border-outline-variant/50' 
                      : 'bg-surface-container-lowest border-outline-variant/30'
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-sm text-on-surface leading-tight">
                      {faq.q}
                    </span>
                    <span 
                      className="material-symbols-outlined text-on-surface-variant transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out text-[13px] text-on-surface-variant leading-relaxed"
                    style={{
                      maxHeight: isExpanded ? '200px' : '0px',
                      padding: isExpanded ? '0px 20px 16px 20px' : '0px 20px 0px 20px'
                    }}
                  >
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-primary/5 border border-primary/10 p-5 text-center flex flex-col items-center gap-3 rounded-2xl">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">support_agent</span>
          </div>
          <div>
            <h4 className="font-bold text-primary text-sm">Still need help?</h4>
            <p className="text-xs text-on-surface-variant mt-1">Contact student support at Academic Block B for assistance.</p>
          </div>
          <button className="mt-2 text-primary font-bold text-xs py-2 px-5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
            Contact Support
          </button>
        </section>

      </main>
    </div>
  );
}
