import React, { useState } from 'react';
import Header from './Header';
import { MockApi } from '../services/mockApi';

export default function ProfileScreen({ 
  onLogout,
  darkMode,
  onToggleDarkMode,
  userName = "Student",
  userEmail = "student@college.edu",
  onNavigateTab,
  onUpdateName
}) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to logout?')) {
      setLoggingOut(true);
      setTimeout(() => {
        onLogout();
      }, 1200);
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    setIsSavingName(true);
    setNameError('');
    try {
      await MockApi.updateProfile(nameInput.trim());
      if (onUpdateName) {
        onUpdateName(nameInput.trim());
      }
      localStorage.setItem('user_name', nameInput.trim());
      setIsEditingName(false);
    } catch (err) {
      setNameError(err.message || 'Failed to update name');
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} />

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto pb-24 py-6 px-6 space-y-8 no-scrollbar">
        
        {/* Profile Card */}
        <section>
          <div className="card-standard flex flex-col items-center text-center relative">
            <div className="mb-4">
              <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                <span className="text-3xl font-extrabold">{userName ? userName.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            </div>

            {!isEditingName ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-on-surface">{userName}</h2>
                  <button 
                    onClick={() => { setNameInput(userName); setIsEditingName(true); setNameError(''); }}
                    className="p-1 hover:bg-surface-container-high rounded-full transition-colors text-primary"
                    title="Edit Name"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
                <p className="text-sm text-on-surface-variant mt-0.5 mb-1">{userEmail}</p>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="w-full max-w-[260px] flex flex-col gap-2 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full h-10 px-3 text-center text-sm font-bold bg-surface-container-low border border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                {nameError && (
                  <p className="text-xs text-error font-medium">{nameError}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-1">
                  <button
                    type="submit"
                    disabled={isSavingName}
                    className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-container disabled:opacity-50"
                  >
                    {isSavingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditingName(false); setNameError(''); }}
                    className="px-3 py-1.5 border border-outline-variant text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Print Wallet Card */}
        <section>
          <div className="gradient-primary p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Print Wallet</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black tracking-tight">₹ 150.00</span>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Funds
              </button>
            </div>
          </div>
        </section>

        {/* Settings List */}
        <section>
          <h3 className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-3.5 px-3">Settings</h3>
          <div className="card-standard !p-0 overflow-hidden">
            
            {/* Edit Full Name Button */}
            <button 
              onClick={() => { setNameInput(userName); setIsEditingName(true); }}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 hover:bg-surface-container-high transition-colors duration-200 active:scale-[0.99] text-left"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">badge</span>
                <div>
                  <span className="text-sm text-on-surface font-semibold block">Full Name</span>
                  <span className="text-xs text-on-surface-variant">{userName}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">edit</span>
            </button>

            {/* Help and Support */}
            <button className="w-full flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 hover:bg-surface-container-high transition-colors duration-200 active:scale-[0.99] text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">help</span>
                <span className="text-sm text-on-surface font-semibold">Help & Support</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>

            {/* Dark Mode Toggle */}
            <div className="w-full flex items-center justify-between px-5 py-4">
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
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 border font-bold text-xs transition-all duration-200 rounded-md ${
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
