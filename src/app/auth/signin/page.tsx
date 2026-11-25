'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Repeat, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { authenticateUser } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    const trimmed = forgotEmail.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setResetError('Please enter a valid registered email address.');
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetSent(true);
      } else {
        setResetError(data.error || 'Failed to send password reset email. Please try again.');
      }
    } catch {
      setResetError('Network error while sending reset link. Please check your connection.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const user = authenticateUser(identifier, password);
      if (!user) {
        setErrorMessage('Invalid username/email or password. Only registered users who have created an account can sign in.');
        setIsSubmitting(false);
        return;
      }

      setCurrentUser(user);
      setIsSubmitting(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      {/* Ambient background light matching Emerald + Deep Navy identity */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ECFDF5] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D1FAE5]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-elevated space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-elevated border border-[#132B45]/20 bg-[#0B1F33] p-1.5 mb-1 group-hover:scale-105 transition">
              <Image
                src="/logo.png"
                alt="PunarNova Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="text-xl font-black tracking-tight text-[#0B1F33]">
                Punar<span className="text-[#10B981] ml-0.5">Nova</span>
              </span>
              <span className="text-[10px] block text-[#64748B] font-medium tracking-wider uppercase">
                Discover • Reuse • Grow
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-[#0B1F33]">Sign In to Campus Account</h1>
          <p className="text-xs text-[#64748B]">
            Enter the credentials created during registration.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">
              Email Address or Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. yourname@iitb.ac.in or admin@punarnova.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] text-[#0F172A]"
              />
              <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#0F172A]">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-[#10B981] hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] text-[#0F172A]"
              />
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#64748B] hover:text-[#0B1F33]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-[11px] text-[#64748B] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#10B981] focus:ring-[#10B981]"
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Administrator Credentials Card */}
        <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-[11px] text-slate-700 space-y-1.5">
          <p className="font-bold text-[#065F46] flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-[#10B981]" />
            Administrator Demo Credentials:
          </p>
          <div className="font-mono text-[10px] bg-white p-2.5 rounded-xl border border-[#A7F3D0] space-y-0.5">
            <div><span className="text-[#64748B]">Email:</span> <span className="text-[#0B1F33] font-bold select-all">admin@punarnova.in</span></div>
            <div><span className="text-[#64748B]">Password:</span> <span className="text-[#0B1F33] font-bold select-all">Admin@PunarNova2026</span></div>
          </div>
          <p className="text-[10px] text-[#64748B] pt-0.5">
            Students: Please sign up with your college email to create your personal account.
          </p>
        </div>

        <div className="text-center text-xs text-[#64748B] pt-1">
          New student on campus?{' '}
          <Link href="/auth/signup" className="text-[#0B1F33] font-black hover:text-[#10B981] underline ml-1">
            Create an Account with Email OTP
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-xs space-y-4 border border-[#E2E8F0]">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetSent(false);
                setResetError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-[#0B1F33] text-base">Reset Account Password</h3>
            {resetSent ? (
              <div className="space-y-3 text-center py-2">
                <p className="text-[#065F46] font-bold bg-[#ECFDF5] p-3.5 rounded-xl border border-[#A7F3D0] leading-relaxed">
                  A password reset link has been sent to <strong>{forgotEmail}</strong>. Please check your inbox and click the link to set a new password.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSent(false);
                    setForgotEmail('');
                  }}
                  className="w-full py-2.5 bg-[#0B1F33] text-white rounded-xl font-bold hover:bg-[#132B45] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-3">
                <p className="text-[#64748B]">
                  Enter your registered email address to receive a secure password reset link.
                </p>
                {resetError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] font-medium">
                    {resetError}
                  </div>
                )}
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your registered email..."
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] text-[#0F172A]"
                />
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl font-bold transition shadow-sm disabled:opacity-50"
                >
                  {isSendingReset ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
