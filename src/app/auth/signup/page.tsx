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
        // Sanitize any debug leaks
        const cleanMsg = (data.message || '').replace(/\(Code:[^)]*\)/gi, '').trim();
        setOtpSuccessMessage(cleanMsg || 'Verification code sent! Please check your email inbox.');
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
        const cleanMsg = (data.message || '').replace(/\(Code:[^)]*\)/gi, '').trim();
        setOtpSuccessMessage(cleanMsg || 'A fresh verification code has been sent to your email inbox.');
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
        setOtpSuccessMessage('');
      } else {
        setErrorMessage(data.error || 'Invalid or expired verification code. Please check and try again.');
      }
    } catch (e) {
      setErrorMessage('Network error during verification. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.acceptTerms) {
      setErrorMessage('Please accept the campus community terms of service.');
      return;
    }

    if (!otpVerified) {
      setErrorMessage('Please verify your educational email address via OTP before completing registration.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Resolve institution
      let targetInstitutionName = formData.institutionName;
      let targetInstitutionId = 'inst-custom';

      if (formData.isCustomInstitution && formData.customInstitutionName.trim()) {
        const added = addCustomInstitution(formData.customInstitutionName.trim(), formData.institutionType);
        targetInstitutionName = added.name;
        targetInstitutionId = added.id;
      } else {
        const found = allInstitutions.find((i) => i.name === formData.institutionName);
        if (found) {
          targetInstitutionId = found.id;
        }
      }

      // 2. Register account persistently in shared localStorage
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        fullName: formData.fullName.trim(),
        role: 'student',
        isMobileVerified: true,
        isEmailVerified: true,
        verificationStatus: 'not_verified',
        institutionId: targetInstitutionId,
        institutionName: targetInstitutionName,
        institutionType: formData.institutionType,
        salesCount: 0,
        purchasesCount: 0,
        carbonSavedKg: 0,
        moneySavedInr: 0,
        createdAt: new Date().toISOString(),
      };

      registerAccount(newUser, formData.password);

      // 3. Set user in app state
      setCurrentUser(newUser);

      // Redirect to verification center to submit ID card for full seller privileges
      router.push('/verification');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      {/* Ambient background light matching Emerald + Deep Navy identity */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ECFDF5] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D1FAE5]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-elevated space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-elevated border border-[#132B45]/20 bg-[#0B1F33] p-1.5 mb-1 group-hover:scale-105 transition">
              <Image
                src="/logo.png"
                alt="PunarNova Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="text-xl font-extrabold tracking-tight text-[#0B1F33]">
                Punar<span className="text-[#10B981] ml-0.5">Nova</span>
              </span>
              <span className="text-[10px] block text-[#64748B] font-medium tracking-wider uppercase">
                Discover • Reuse • Grow
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-[#0B1F33]">Create Student Account</h1>
          <p className="text-xs text-[#64748B]">
            Join your campus peer network to buy, sell, and swap educational materials.
          </p>
        </div>

        {/* Registration Form Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E2E8F0] w-full" />
          <span className="bg-white px-3 text-[11px] text-[#64748B] font-medium absolute">Register with student email</span>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Full Name */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Full Legal Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] text-[#0F172A]"
              />
              <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
            </div>
          </div>

          {/* 2. Institutional Email Address & Email OTP Verification */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] disabled:bg-slate-100 disabled:text-slate-500 text-[#0F172A]"
                />
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              </div>
              {!otpVerified && (
                <button
                  type="button"
                  disabled={isSendingOtp || (otpSent && otpTimer > 0)}
                  onClick={otpSent ? handleResendOtp : handleSendOtp}
                  className="px-4 py-2.5 bg-[#0B1F33] hover:bg-[#132B45] disabled:bg-slate-300 text-white rounded-xl font-bold transition shrink-0 text-xs sm:text-sm shadow-xs"
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
              <p className="text-xs text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 rounded-xl mt-2 font-medium">
                {otpSuccessMessage}
              </p>
            )}

            {/* Email OTP Input Box */}
            {otpSent && !otpVerified && (
              <div className="mt-2.5 p-4 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B1F33] text-xs">
                    Enter the 6-digit verification code sent to your email:
                  </span>
                </div>
                <div className="flex space-x-2.5">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={formData.otpCode}
                    onChange={(e) => setFormData({ ...formData, otpCode: e.target.value.replace(/\D/g, '') })}
                    className="w-36 text-center font-mono font-black tracking-widest text-base p-2.5 rounded-xl border border-[#10B981] bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 text-[#0B1F33]"
                  />
                  <button
                    type="button"
                    disabled={isVerifyingOtp || formData.otpCode.length !== 6}
                    onClick={handleVerifyOtp}
                    className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-[#0B1F33] hover:text-white rounded-xl font-bold text-xs transition shadow-xs"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Didn't receive the code? Check spam or click Resend {otpTimer > 0 ? `in ${otpTimer}s` : 'above'}.
                </p>
              </div>
            )}

            {otpVerified && (
              <p className="text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 rounded-xl text-xs font-bold flex items-center mt-2">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#10B981] shrink-0" />
                Email address verified successfully via One-Time Password
              </p>
            )}
          </div>

          {/* 3. Mobile Number */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Mobile Contact Number</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] text-[#0F172A]"
              />
              <Phone className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
            </div>
          </div>

          {/* 4. Institution Name & Type */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Institution Type</label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50 focus:outline-none focus:border-[#10B981] font-medium text-[#0F172A]"
                >
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Institution Campus</label>
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
                    className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50 focus:outline-none focus:border-[#10B981] font-medium text-[#0F172A]"
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
                      className="w-full p-2.5 rounded-xl border border-[#10B981] bg-[#ECFDF5]/50 focus:outline-none text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isCustomInstitution: false })}
                      className="text-[11px] text-[#64748B] hover:text-[#0B1F33] mt-1 inline-block underline font-medium"
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
                  className="text-xs text-[#10B981] font-bold hover:underline"
                >
                  Can't find your college? Click to enter your college name
                </button>
              </div>
            )}
          </div>

          {/* 5. Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#10B981] text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-[#64748B] hover:text-[#0B1F33]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#10B981] text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-3 text-[#64748B] hover:text-[#0B1F33]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Privacy acceptance */}
          <label className="flex items-start space-x-2 text-[11px] text-[#64748B] pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="rounded text-[#10B981] focus:ring-[#10B981] mt-0.5"
            />
            <span>
              I accept the <strong className="text-[#0B1F33]">Terms of Campus Service</strong> and consent to DPDP Act privacy safeguards for student verification.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald flex items-center justify-center space-x-2 disabled:opacity-50"
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

        <div className="text-center text-xs text-[#64748B] pt-2">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#0B1F33] font-black hover:text-[#10B981] underline ml-1">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
