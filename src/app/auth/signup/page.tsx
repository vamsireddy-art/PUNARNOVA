'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Repeat, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Building, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { InstitutionType, User } from '@/types';
import { useAppStore } from '@/lib/store';
import { registerAccount } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { setCurrentUser, allInstitutions, addCustomInstitution } = useAppStore();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    otpCode: '',
    email: '',
    institutionName: 'Indian Institute of Technology (IIT) Bombay',
    institutionType: 'University' as InstitutionType,
    customInstitutionName: '',
    isCustomInstitution: false,
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');

  // Countdown timer for resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid educational/student email address.');
      return;
    }
    setErrorMessage('');
    setOtpSuccessMessage('');
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtpTimer(60); // 60s cooldown
        setOtpSuccessMessage('Verification code sent! Please check your email inbox.');
        setFormData((prev) => ({ ...prev, otpCode: '' }));
      } else {
        setErrorMessage(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (e) {
      setErrorMessage('Network error while sending OTP. Please check your connection.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid educational/student email address.');
      return;
    }
    setErrorMessage('');
    setOtpSuccessMessage('');
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/otp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpTimer(60);
        setOtpSuccessMessage('A fresh verification code has been sent to your email inbox.');
        setFormData((prev) => ({ ...prev, otpCode: '' }));
      } else {
        setErrorMessage(data.error || 'Failed to resend code.');
      }
    } catch (e) {
      setErrorMessage('Network error while resending OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otpCode || formData.otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code you received.');
      return;
    }
    setErrorMessage('');
    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otpCode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        setOtpSuccessMessage('Email verified successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage(data.error || 'Invalid or expired OTP code.');
      }
    } catch (e) {
      setErrorMessage('Network error while verifying OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpVerified) {
      setErrorMessage('Please verify your educational email with the OTP code first.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage('You must accept the terms of service and DPDP privacy policy.');
      return;
    }

    const finalInstitutionName = formData.isCustomInstitution
      ? formData.customInstitutionName.trim()
      : formData.institutionName;

    if (formData.isCustomInstitution && !formData.customInstitutionName.trim()) {
      setErrorMessage('Please enter the name of your college / institution.');
      return;
    }

    setIsSubmitting(true);

    if (formData.isCustomInstitution && formData.customInstitutionName.trim()) {
      addCustomInstitution(formData.customInstitutionName.trim(), formData.institutionType);
    }

    setTimeout(() => {
      // Create user session and register account credentials
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        fullName: formData.fullName.trim(),
        institutionName: finalInstitutionName,
        institutionType: formData.institutionType,
        role: 'student',
        isMobileVerified: true,
        isEmailVerified: true,
        verificationStatus: 'pending',
        salesCount: 0,
        purchasesCount: 0,
        carbonSavedKg: 0,
        moneySavedInr: 0,
        createdAt: new Date().toISOString(),
      };

      registerAccount(newUser, formData.password);
      setCurrentUser(newUser);

      setIsSubmitting(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 relative overflow-hidden">
      {/* Ambient background light matching PunarNova cosmic identity */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 shadow-elevated space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-elevated border border-slate-700/40 bg-navy-950 mb-1 group-hover:scale-105 transition">
              <Image
                src="/logo.png"
                alt="PunarNova Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="text-xl font-bold tracking-tight text-navy-900">
                Punar<span className="text-brand-blue ml-0.5">Nova</span>
              </span>
              <span className="text-[10px] block text-slate-500 font-medium tracking-wider uppercase">
                Discover • Reuse • Grow
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-navy-900">Create Student Account</h1>
          <p className="text-xs text-slate-500">
            Join your campus peer network to buy, sell, and swap educational materials.
          </p>
        </div>

        {/* Registration Form Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 absolute">Register with student email</span>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* 2. Institutional Email Address & Email OTP Verification */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address (Email OTP Verification)
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  disabled={otpVerified}
                  placeholder="e.g. aarav.sharma@iitb.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 disabled:bg-slate-100 disabled:text-slate-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {!otpVerified && (
                <button
                  type="button"
                  disabled={isSendingOtp || (otpSent && otpTimer > 0)}
                  onClick={otpSent ? handleResendOtp : handleSendOtp}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-medium transition shrink-0 text-xs sm:text-sm"
                >
                  {isSendingOtp
                    ? 'Sending...'
                    : otpSent
                    ? otpTimer > 0
                      ? `Resend (${otpTimer}s)`
                      : 'Resend OTP'
                    : 'Send Email OTP'}
                </button>
              )}
            </div>

            {/* OTP Status Messages */}
            {otpSuccessMessage && !otpVerified && (
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 p-2 rounded-lg mt-2">
                {otpSuccessMessage}
              </p>
            )}

            {/* Email OTP Input Box */}
            {otpSent && !otpVerified && (
              <div className="mt-2.5 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900 text-xs">
                    Enter the 6-digit verification code sent to your email:
                  </span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={formData.otpCode}
                    onChange={(e) => setFormData({ ...formData, otpCode: e.target.value.replace(/\D/g, '') })}
                    className="w-36 text-center font-mono font-bold tracking-widest text-base p-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <button
                    type="button"
                    disabled={isVerifyingOtp || formData.otpCode.length !== 6}
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 bg-brand-blue hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Didn't receive the code? Check spam or click Resend {otpTimer > 0 ? `in ${otpTimer}s` : 'above'}.
                </p>
              </div>
            )}

            {otpVerified && (
              <p className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 p-2 rounded-lg text-xs font-medium flex items-center mt-2">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 shrink-0" />
                Email address verified successfully via One-Time Password
              </p>
            )}
          </div>

          {/* 3. Mobile Number */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mobile Contact Number</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* 4. Institution Name & Type */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution Type</label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                >
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution Campus</label>
                {!formData.isCustomInstitution ? (
                  <select
                    value={formData.institutionName}
                    onChange={(e) => {
                      if (e.target.value === '__OTHER__') {
                        setFormData({ ...formData, isCustomInstitution: true });
                      } else {
                        setFormData({ ...formData, institutionName: e.target.value });
                      }
                    }}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    {allInstitutions.map((inst) => (
                      <option key={inst.id} value={inst.name}>{inst.name}</option>
                    ))}
                    <option value="__OTHER__">+ Other (Add my college/school)...</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your college/school name..."
                      value={formData.customInstitutionName}
                      onChange={(e) => setFormData({ ...formData, customInstitutionName: e.target.value })}
                      className="w-full p-2 rounded-xl border border-brand-blue bg-blue-50/20 focus:outline-none text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isCustomInstitution: false })}
                      className="text-[11px] text-slate-400 hover:text-slate-600 mt-1 inline-block underline"
                    >
                      ← Back to list
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!formData.isCustomInstitution && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isCustomInstitution: true })}
                  className="text-xs text-brand-blue font-semibold hover:underline"
                >
                  Can't find your college? Click to enter your college name
                </button>
              </div>
            )}
          </div>

          {/* 5. Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Privacy acceptance */}
          <label className="flex items-start space-x-2 text-[11px] text-slate-600 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="rounded text-brand-blue focus:ring-brand-blue mt-0.5"
            />
            <span>
              I accept the <strong className="text-slate-800">Terms of Campus Service</strong> and consent to DPDP Act privacy safeguards for student verification.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition shadow-soft flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating Verified Profile...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-brand-blue font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
