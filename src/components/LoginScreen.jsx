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
    <div className="flex-1 bg-surface text-on-surface flex flex-col items-center justify-center p-6 h-full relative">
      <div className="absolute top-10 left-6">
        <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-md">
          <span className="material-symbols-outlined text-[24px] text-white">print</span>
        </div>
      </div>

      <div className="w-full max-w-sm mt-10">
        <h1 className="text-3xl font-extrabold text-on-surface mb-2">Welcome</h1>
        <p className="text-sm text-on-surface-variant mb-10">
          Sign in to track your print jobs and history.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {step === 'choice' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep('email')}
              className="w-full h-14 bg-primary text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              Login with College Email
            </button>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full h-14 bg-surface-container-highest text-on-surface font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all border border-outline-variant/30"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Continue as Guest
                </>
              )}
            </button>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">College Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-2 shadow-md shadow-primary/20"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('choice'); setError(''); }}
              className="mt-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Back
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center tracking-[0.5em] font-bold text-lg"
                required
                maxLength={6}
              />
              <p className="text-xs text-on-surface-variant mt-2 text-center">OTP sent to {email}</p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-2 shadow-md shadow-primary/20"
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="mt-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
