import React, { useState, useEffect } from 'react';
import { MockApi } from '../services/mockApi';

export default function LoginScreen({ onLoginSuccess }) {
  const [step, setStep] = useState('choice'); // 'choice' | 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 60-second resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await MockApi.guestLogin();
      localStorage.setItem('kiosk_token', data.token);
      localStorage.setItem('user_name', 'Guest User');
      localStorage.setItem('user_email', 'guest@printm.kiosk');
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Failed to login as guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      return setError("Please enter a valid email address");
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await MockApi.sendOtp(email);
      setIsNewUser(Boolean(res.isNewUser));
      setStep('otp');
      setResendCooldown(45);
      if (res && res.otp) {
        setOtp(res.otp);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter the 6-digit OTP");
    if (isNewUser && (!fullName || !fullName.trim())) {
      return setError("Please enter your full name to create an account");
    }

    setIsLoading(true);
    setError('');
    try {
      const data = await MockApi.verifyOtp(email, otp, fullName ? fullName.trim() : undefined);
      localStorage.setItem('kiosk_token', data.token);
      const savedName = data.user.name || (fullName ? fullName.trim() : email.split('@')[0]);
      localStorage.setItem('user_name', savedName);
      localStorage.setItem('user_email', email);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-surface flex flex-col items-center justify-center p-6 h-full relative overflow-hidden text-on-surface">
      <div className="-mt-10 card-standard shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-outline-variant/30 rounded-3xl w-full max-w-[350px] relative z-10 p-7 flex flex-col items-center text-center">
        
        {/* Centered Logo */}
        <div className="w-24 h-24 bg-primary text-white flex items-center justify-center rounded-2xl shadow-md mb-6">
          <span className="material-symbols-outlined" style={{ fontSize: '56px', fontVariationSettings: "'FILL' 1" }}>
            print
          </span>
        </div>

        <h1 className="text-2xl font-black text-on-surface mb-1.5 tracking-tight">Welcome to PrinTM</h1>
        <p className="text-xs text-on-surface-variant mb-6 px-2">
          Fast, autonomous campus printing station
        </p>

        {error && (
          <div className="w-full mb-5 p-3 bg-error-container text-on-error-container text-xs rounded-xl font-semibold animate-fade-in-up text-left flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CHOICE */}
        {step === 'choice' && (
          <div className="w-full flex flex-col gap-3.5">
            <button
              onClick={() => { setStep('email'); setError(''); }}
              className="btn-primary w-full text-xs tracking-wider uppercase font-bold !rounded-xl"
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              Continue with Email
            </button>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full h-12 bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 border border-outline-variant/30 hover:bg-surface-container-highest disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Continue as Guest
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: EMAIL */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
            <div className="text-left">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pl-1">
                College Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full h-[50px] px-4 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-on-surface-variant/50 text-sm font-medium"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !rounded-xl"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">send</span>
              )}
              {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('choice'); setError(''); }}
              className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors duration-200 py-1"
            >
              Back
            </button>
          </form>
        )}

        {/* STEP 3: OTP (+ NAME FOR NEW USERS) */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-3.5 text-left">
            {isNewUser ? (
              <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-semibold flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>First time? Create your student account below.</span>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant mb-1">
                Enter the 6-digit code sent to <strong className="text-on-surface">{email}</strong>
              </p>
            )}

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full h-[48px] px-4 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-center tracking-[0.4em] font-mono font-bold text-lg placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-on-surface-variant/40"
                required
                maxLength={6}
                autoFocus
              />
            </div>

            {/* If New User: Capture Full Name */}
            {isNewUser && (
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Durgesh Kumar"
                  className="w-full h-[48px] px-4 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-sm font-semibold"
                  required={isNewUser}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6 || (isNewUser && !fullName.trim())}
              className="btn-primary w-full !rounded-xl mt-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : isNewUser ? (
                <span className="material-symbols-outlined text-[20px]">check</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              )}
              {isLoading 
                ? 'Verifying...' 
                : isNewUser 
                  ? 'Create Account & Continue' 
                  : 'Verify & Login'
              }
            </button>

            {/* Resend Cooldown Section */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                Change Email
              </button>

              {resendCooldown > 0 ? (
                <span className="text-xs text-on-surface-variant font-medium">
                  Resend in <strong>{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
