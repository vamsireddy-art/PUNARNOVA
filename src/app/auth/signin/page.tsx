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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 relative overflow-hidden">
      {/* Ambient background light matching PunarNova cosmic identity */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 shadow-elevated space-y-6 relative z-10">
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
          <h1 className="text-2xl font-extrabold text-navy-900">Sign In to Campus Account</h1>
          <p className="text-xs text-slate-500">
            Enter the credentials created during registration.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address or Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. yourname@iitb.ac.in or admin@punarnova.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-brand-blue hover:underline"
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
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-brand-blue focus:ring-brand-blue"
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition shadow-soft flex items-center justify-center space-x-1.5 disabled:opacity-50"
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
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-800 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-600" />
            Administrator Credentials:
          </p>
          <div className="font-mono text-[10px] bg-white p-2 rounded-lg border border-slate-200 space-y-0.5">
            <div><span className="text-slate-400">Email:</span> <span className="text-slate-800 font-semibold select-all">admin@punarnova.in</span></div>
            <div><span className="text-slate-400">Password:</span> <span className="text-slate-800 font-semibold select-all">Admin@PunarNova2026</span></div>
          </div>
          <p className="text-[10px] text-slate-400 pt-0.5">
            Students: Please sign up with your email to create your personal account.
          </p>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          New student on campus?{' '}
          <Link href="/auth/signup" className="text-brand-blue font-bold hover:underline">
            Create an Account with Email OTP
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-xs space-y-4">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetSent(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-navy-900 text-base">Reset Account Password</h3>
            {resetSent ? (
              <div className="space-y-3 text-center py-2">
                <p className="text-emerald-600 font-semibold">
                  Password reset link has been dispatched to your institutional email.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-navy-900 text-white rounded-xl font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-500">
                  Enter your registered institutional email or phone number to receive an OTP reset link.
                </p>
                <input
                  type="text"
                  placeholder="Enter email or mobile..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="w-full py-2.5 bg-brand-blue text-white rounded-xl font-bold"
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
