'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { resetAccountPassword } from '@/lib/auth';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [tokenError, setTokenError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenError('Missing password reset token. Please use the link sent to your email.');
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, action: 'verify' }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.email) {
          setTokenValid(true);
          setTargetEmail(data.email);
        } else {
          setTokenValid(false);
          setTokenError(data.error || 'This password reset link is invalid or has expired.');
        }
      } catch {
        setTokenValid(false);
        setTokenError('Network error while verifying reset link. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to reset password. Your link may have expired.');
        setIsSubmitting(false);
        return;
      }

      const updateResult = resetAccountPassword(data.email || targetEmail, newPassword);
      if (!updateResult.success) {
        setErrorMessage(
          updateResult.error ||
            'Could not locate your account in this browser. Please ensure you open the reset link in the same browser where you registered.'
        );
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage('Network error while updating password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ECFDF5] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D1FAE5]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-elevated space-y-6 relative z-10">
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
              <span className="text-xl font-black tracking-tight text-[#0B1F33]">
                Punar<span className="text-[#10B981] ml-0.5">Nova</span>
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-[#0B1F33]">Reset Password</h1>
          {targetEmail && !tokenError && (
            <p className="text-xs text-[#64748B]">
              Updating password for <strong className="text-[#0B1F33]">{targetEmail}</strong>
            </p>
          )}
        </div>

        {isValidating ? (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#10B981] animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#64748B]">Verifying your secure reset link...</p>
          </div>
        ) : !tokenValid ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs space-y-1.5">
              <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
              <p className="font-bold">Invalid or Expired Link</p>
              <p>{tokenError}</p>
            </div>
            <Link
              href="/auth/signin"
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald flex items-center justify-center space-x-2"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="p-5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-[#065F46] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
              <h2 className="text-base font-black text-[#0B1F33]">Password Changed Successfully!</h2>
              <p className="text-xs leading-relaxed">
                Your password for <strong>{targetEmail}</strong> has been updated. You can now sign in with your new password.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/auth/signin')}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald flex items-center justify-center space-x-2"
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] text-[#0F172A]"
                />
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-[#64748B] hover:text-[#0B1F33]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[11px] text-[#065F46] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Use at least 8 characters to keep your campus account secure.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-xs text-[#64748B]">
          Loading password reset...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
