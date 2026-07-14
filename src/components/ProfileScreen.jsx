import React, { useState } from 'react';
import Header from './Header';

export default function ProfileScreen({ 
  onLogout,
  darkMode,
  onToggleDarkMode,
  userName = "Durgesh Kumar",
  userEmail = "Durgesh@sharda.ac.in",
  onNavigateTab
}) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to logout?')) {
      setLoggingOut(true);
      setTimeout(() => {
        onLogout();
      }, 1200);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} />

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto pb-24 py-6 px-6 space-y-8 no-scrollbar">
        
        {/* Profile Card */}
        <section>
          <div className="bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/20 flex flex-col items-center text-center rounded-2xl">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center border-4 border-outline-variant/30 overflow-hidden shadow-inner">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZv3oNc1UQah_cE6NZia9JmsO_884M8wH_YqCbC07uMDFaYJku_GJiC_mhFAY2XKiEmE9uFJQLAaJwXNrirU4FRxaoPfofGBPWysbCDpv8CVRvNmdGOiCbokTN2GsXkjcKUlr5L3BRvYxcLIZReBbQsf9zVS-chG7WDh5qWMfG3bv7G5Wrhs3VeO1JeSoPp-NdSEGsn5RLyEMWXTXU2RFaZwit3D3Mk188C7tA5NALVvXa6iDKbcyTfYv2DYynA1Id3PVRnO8wbsHn"
                  alt="Student Avatar"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-white shadow cursor-pointer hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-white text-xs block" style={{ fontSize: '14px' }}>edit</span>
              </div>
            </div>
            <h2 className="text-headline-sm font-bold text-on-surface">{userName}</h2>
            <p className="text-body-sm text-on-surface-variant mb-5">{userEmail}</p>
            <button className="w-full py-2.5 px-6 border border-outline-variant/30 text-primary font-bold text-xs hover:bg-surface-container-highest transition-all active:scale-[0.98] rounded-xl">
              Edit Profile
            </button>
          </div>
        </section>

        {/* Print Wallet Card */}
        <section>
          <div className="bg-gradient-to-br from-primary to-[#0059bb] p-6 rounded-2xl text-white shadow-[0px_8px_24px_rgba(0,89,187,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Print Wallet</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black tracking-tight">₹ 150.00</span>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Funds
              </button>
            </div>
          </div>
        </section>

        {/* Settings List */}
        <section>
          <h3 className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-3.5 px-3">Settings</h3>
          <div className="bg-surface-container-lowest border border-outline-variant/20 overflow-hidden shadow-sm rounded-2xl">
            
            {/* Help and Support */}
            <button className="w-full flex items-center justify-between p-4.5 border-b border-outline-variant/30 hover:bg-surface-container-high transition-colors active:scale-[0.99] text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">help</span>
                <span className="text-sm text-on-surface font-semibold">Help & Support</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>

            {/* Dark Mode Toggle */}
            <div className="w-full flex items-center justify-between p-4.5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                <span className="text-sm text-on-surface font-semibold">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={(e) => onToggleDarkMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

          </div>
        </section>

        {/* Account Action Section */}
        <section>
          <button 
            onClick={handleLogoutClick}
            disabled={loggingOut}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 border font-bold text-xs transition-all duration-200 rounded-xl ${
              loggingOut 
                ? 'border-outline-variant/50 bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                : 'border-red-200 hover:border-red-400 text-error hover:bg-red-50/20 active:scale-[0.98]'
            }`}
          >
            {loggingOut ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[16px]">sync</span>
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Logout</span>
              </>
            )}
          </button>
        </section>

        {/* App Info / Footer */}
        <footer className="text-center py-6 select-none">
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">PrintM v1.0</p>
            <p className="text-xs text-on-surface-variant">Made with ❤️ for Campus</p>
            <div className="mt-3.5 opacity-20">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>print</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
