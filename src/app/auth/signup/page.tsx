'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { InstitutionType } from '@/types';
import { useAppStore } from '@/lib/store';

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
  const [otpTimer, setOtpTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid educational/student email address.');
      return;
    }
    setErrorMessage('');
    setOtpSent(true);
    // Simulate automated OTP delivery to the student's email inbox
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, otpCode: '5924' }));
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (formData.otpCode === '5924' || formData.otpCode.length === 4) {
      setOtpVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid OTP code. Please enter the 4-digit code sent to your email (Demo: 5924).');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

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
      // Create user session
      setCurrentUser({
        id: `user-${Date.now()}`,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        fullName: formData.fullName,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
      });

      setIsSubmitting(false);
      router.push('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-elevated space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center">
              <Repeat className="w-5 h-5 text-brand-green" />
            </div>
            <span className="text-xl font-bold tracking-tight text-navy-900">
              Punar<span className="text-brand-blue">Nova</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-navy-900">Create Student Account</h1>
          <p className="text-xs text-slate-500">
            Join your campus peer network to buy, sell, and swap educational materials.
          </p>
        </div>

        {/* Google Quick Sign Up */}
        <button
          type="button"
          onClick={() => {
            setFormData({
              ...formData,
              fullName: 'Aarav Sharma',
              email: 'aarav.sharma@iitb.ac.in',
              mobileNumber: '+91 98765 43210',
            });
            setOtpVerified(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign up with Google (Institutional Account)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 absolute">Or register with student email</span>
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
                  placeholder="e.g. aarav.sharma@iitb.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition shrink-0"
              >
                {otpSent ? 'Resend OTP' : 'Send Email OTP'}
              </button>
            </div>

            {/* Email OTP Input Box */}
            {otpSent && !otpVerified && (
              <div className="mt-2.5 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900 text-[11px]">
                    Enter 4-digit OTP sent to your email inbox (Demo: <strong>5924</strong>)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.otpCode}
                    onChange={(e) => setFormData({ ...formData, otpCode: e.target.value })}
                    className="w-32 text-center font-mono font-bold tracking-widest text-sm p-1.5 rounded-lg border border-blue-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-3.5 py-1.5 bg-brand-blue hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                  >
                    Verify Email OTP
                  </button>
                </div>
              </div>
            )}

            {otpVerified && (
              <p className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 p-2 rounded-lg text-[11px] font-medium flex items-center mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
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
