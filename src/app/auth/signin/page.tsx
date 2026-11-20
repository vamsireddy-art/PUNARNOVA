'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { MOCK_USERS } from '@/lib/mock-data';

export default function SignInPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();

  const [identifier, setIdentifier] = useState('aarav.sharma@iitb.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Find matching mock user or log in Aarav
      let user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.mobileNumber.includes(identifier)
      );
      if (!user) {
        user = MOCK_USERS[0];
      }

      setCurrentUser(user);
      setIsSubmitting(false);
      router.push('/');
    }, 800);
  };

  const handleQuickDemo = (userIndex: number) => {
    setCurrentUser(MOCK_USERS[userIndex]);
    router.push('/');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-elevated space-y-6">
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
          <h1 className="text-2xl font-extrabold text-navy-900">Sign In to Campus Account</h1>
          <p className="text-xs text-slate-500">
            Access your campus educational marketplace, orders, and saved listings.
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <p className="font-bold text-navy-900 flex items-center text-[11px]">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-blue" />
            Quick 1-Click Persona Sign In:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => handleQuickDemo(0)}
              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue font-bold rounded-lg transition"
            >
              Verified Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(1)}
              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg transition"
            >
              Unverified Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(2)}
              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg transition"
            >
              Campus Admin
            </button>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => handleQuickDemo(0)}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 absolute">Or with email / mobile</span>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="email@iitb.ac.in or +91 9876543210"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
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
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          New to PunarNova?{' '}
          <Link href="/auth/signup" className="text-brand-blue font-bold hover:underline">
            Create an Account
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
