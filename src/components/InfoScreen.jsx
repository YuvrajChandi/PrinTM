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

        {/* Steps Timeline */}
        <section className="relative px-2">
          <div className="absolute left-[26px] top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0"></div>
          
          <div className="space-y-6 relative z-10">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 shrink-0 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,89,187,0.4)] border-4 border-background">
                <span className="material-symbols-outlined text-white text-[18px]">upload_file</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-sm text-on-surface mb-1">Upload Document</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Choose a PDF from your device. Max file size is 50 MB.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 shrink-0 bg-surface-container-highest rounded-full flex items-center justify-center border-4 border-background text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-sm text-on-surface mb-1">Configure Settings</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Select B&W or color, orientation, and copies. Price updates instantly.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 shrink-0 bg-surface-container-highest rounded-full flex items-center justify-center border-4 border-background text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-sm text-on-surface mb-1">Get Print Code</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Confirm your order to generate a unique, secure QR code.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 shrink-0 bg-surface-container-highest rounded-full flex items-center justify-center border-4 border-background text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">print</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-sm text-on-surface mb-1">Print at Kiosk</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Scan your QR code at any PrintM kiosk. Files are deleted after printing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Kiosk Status */}
        <section className="bg-surface-container-lowest p-5 shadow-[0px_4px_16px_rgba(0,89,187,0.06)] border border-outline-variant/30 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-on-surface">Kiosk Locations</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Live Status
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-highest/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">local_library</span>
                <div>
                  <p className="font-bold text-[13px] text-on-surface leading-tight">Central Library</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Ground Floor Lobby</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md uppercase tracking-wider">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-highest/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">restaurant</span>
                <div>
                  <p className="font-bold text-[13px] text-on-surface leading-tight">Student Centre</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Near Cafeteria</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md uppercase tracking-wider">Online</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-highest/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">apartment</span>
                <div>
                  <p className="font-bold text-[13px] text-on-surface leading-tight">Academic Block B</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">2nd Floor Corridor</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-1 rounded-md uppercase tracking-wider">Offline</span>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="flex flex-col gap-4">
          <h2 className="font-headline text-headline-sm font-bold text-primary">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqData.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`overflow-hidden transition-all duration-300 rounded-xl ${
                    isExpanded 
                      ? 'bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-outline-variant/30' 
                      : 'bg-surface-container-lowest/50 border border-transparent hover:bg-surface-container-lowest'
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-[13px] text-on-surface leading-tight">
                      {faq.q}
                    </span>
                    <span 
                      className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'text-primary rotate-180' : 'text-on-surface-variant rotate-0'}`}
                    >
                      expand_more
                    </span>
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out text-[13px] text-on-surface-variant leading-relaxed"
                    style={{
                      maxHeight: isExpanded ? '200px' : '0px',
                      padding: isExpanded ? '0px 20px 16px 20px' : '0px 20px 0px 20px',
                      opacity: isExpanded ? 1 : 0
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
        <section className="bg-gradient-to-br from-[#001f3f] to-[#003366] p-6 text-white rounded-2xl relative overflow-hidden shadow-lg">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Need Assistance?</h4>
              <p className="text-[11px] text-white/70 mt-0.5 leading-snug">Our student support team at Academic Block B is here to help you.</p>
            </div>
          </div>
          <button className="relative z-10 mt-5 w-full py-3 bg-white text-[#001f3f] font-bold text-xs rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all shadow-sm">
            Contact Support
          </button>
        </section>

      </main>
    </div>
  );
}
