import React, { useState } from 'react';
import { MockApi } from '../services/mockApi';

export default function LoginScreen({ onLoginSuccess }) {
  const [step, setStep] = useState('choice'); // 'choice' | 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await MockApi.guestLogin();
      // Store token (in a real app, use Context or secure cookie)
      localStorage.setItem('kiosk_token', data.token);
      localStorage.setItem('user_name', 'Guest User');
      localStorage.setItem('user_email', 'guest@printm.kiosk');
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Failed to login as guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    setIsLoading(true);
    setError('');
    try {
      await MockApi.sendOtp(email);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter the OTP");
    setIsLoading(true);
    setError('');
    try {
      const data = await MockApi.verifyOtp(email, otp);
      localStorage.setItem('kiosk_token', data.token);
      localStorage.setItem('user_name', email.split('@')[0]);
      localStorage.setItem('user_email', email);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-surface flex flex-col items-center justify-center p-6 h-full relative overflow-hidden text-on-surface">
      <div className="-mt-16 card-standard shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-outline-variant/30 rounded-3xl w-full max-w-[340px] relative z-10 p-8 flex flex-col items-center text-center">
        
        {/* Centered Logo */}
        <div className="w-32 h-32 bg-primary text-white flex items-center justify-center rounded-2xl shadow-lg mb-8">
          <span className="material-symbols-outlined" style={{ fontSize: '80px' }}>print</span>
        </div>

        <h1 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">Welcome</h1>
        <p className="text-sm text-on-surface-variant mb-8 px-4">
          Sign in to track your print jobs and history.
        </p>

        {error && (
          <div className="w-full mb-6 p-3 bg-error-container text-on-error-container text-sm rounded-md font-medium animate-fade-in-up">
            {error}
          </div>
        )}

        {step === 'choice' && (
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={() => setStep('email')}
              className="btn-primary w-full whitespace-nowrap text-[13px] tracking-wide"
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              Login with Email
            </button>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full h-12 bg-surface-container-highest text-on-surface font-bold text-sm rounded-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 border border-outline-variant/30 hover:bg-surface-container-highest/80 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  Continue as Guest
                </>
              )}
            </button>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
            <div className="text-left">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pl-1">College Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full h-[52px] px-4 bg-surface-container-low border border-outline-variant/40 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-on-surface-variant/50 text-sm font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">send</span>
              )}
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('choice'); setError(''); }}
              className="mt-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200 py-2"
            >
              Back
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
            <div className="text-left">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pl-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full h-[52px] px-4 bg-surface-container-low border border-outline-variant/40 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-center tracking-[0.5em] font-bold text-lg placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-on-surface-variant/50"
                required
                maxLength={6}
              />
              <p className="text-[11px] text-on-surface-variant mt-3 text-center">OTP sent to <span className="font-bold">{email}</span></p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              )}
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="mt-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200 py-2"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
