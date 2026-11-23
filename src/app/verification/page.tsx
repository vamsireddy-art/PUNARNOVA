'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { VerificationModal } from '@/components/verification-modal';

export default function VerificationCenterPage() {
  const { currentUser, setCurrentUser, verifications } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  // If user is verified by any approved submission in history, sync status immediately
  const myRequests = currentUser
    ? verifications.filter(
        (v) =>
          v.userId === currentUser.id ||
          (currentUser.email && v.userEmail?.toLowerCase() === currentUser.email.toLowerCase())
      )
    : [];

  const hasApprovedSubmission = myRequests.some((r) => r.status === 'verified');
  const effectiveVerificationStatus =
    currentUser?.verificationStatus === 'verified' || hasApprovedSubmission
      ? 'verified'
      : currentUser?.verificationStatus || 'not_verified';

  // Synchronize state if approved submission found
  React.useEffect(() => {
    if (currentUser && hasApprovedSubmission && currentUser.verificationStatus !== 'verified') {
      setCurrentUser({
        ...currentUser,
        verificationStatus: 'verified',
        isEmailVerified: true,
        isMobileVerified: true,
      });
    }
  }, [currentUser, hasApprovedSubmission, setCurrentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-blue mx-auto flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-navy-900">Sign In to Access Verification</h2>
        <p className="text-xs text-slate-500">
          Please sign in to view your student verification status or submit your student ID card.
        </p>
        <Link
          href="/auth/signin"
          className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold inline-block transition"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const statusConfigs: Record<string, { label: string; color: string; icon: any }> = {
    verified: {
      label: 'Verified Student Seller',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
    },
    pending: {
      label: 'Verification Pending Review',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
    },
    rejected: {
      label: 'Verification Clarification Required',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: AlertCircle,
    },
    not_verified: {
      label: 'Not Verified',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: ShieldAlert,
    },
  };

  const currentStatusConfig = statusConfigs[effectiveVerificationStatus] || statusConfigs.not_verified;
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-brand-green" />
          <span>Trust & Identity Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Student Seller Verification Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Only verified student accounts can publish product listings to keep campus transactions safe.
        </p>
      </div>

      {/* Current Status Card */}
      <div className={`p-6 rounded-3xl border ${currentStatusConfig.color} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shrink-0">
              <StatusIcon className="w-6 h-6 text-current" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                Your Seller Verification Status
              </span>
              <h2 className="text-xl font-bold">{currentStatusConfig.label}</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Account: {currentUser.fullName} ({currentUser.institutionName || 'Aditya University'})
              </p>
            </div>
          </div>

          {effectiveVerificationStatus !== 'verified' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition shadow-soft shrink-0"
            >
              {effectiveVerificationStatus === 'pending' ? 'Update Documents' : 'Submit Student ID'}
            </button>
          )}
        </div>
      </div>

      {/* Official Safe Handover Spots on Your Campus */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-navy-900">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            <h3 className="font-extrabold text-base">Campus Safe Handover Zones</h3>
          </div>
          <span className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {currentUser.institutionName || 'Aditya University'}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          To ensure personal safety, never meet in unstaffed or secluded areas. PunarNova handovers and swaps are designated at these monitored campus locations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-navy-900 block">Central Campus Library Foyer</span>
            <span className="text-[11px] text-slate-500 block">Ground floor reading hall turnstiles • 9:00 AM - 7:00 PM</span>
            <span className="text-[10px] text-brand-green font-bold">Staffed & Monitored Zone</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-navy-900 block">Student Activity Center (SAC)</span>
            <span className="text-[11px] text-slate-500 block">Indoor complex reception lobby • 10:00 AM - 8:00 PM</span>
            <span className="text-[10px] text-brand-green font-bold">Staffed & Monitored Zone</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-navy-900 block">Main Campus Security Gate #1</span>
            <span className="text-[11px] text-slate-500 block">Visitor registration desk • 24 Hours staffed</span>
            <span className="text-[10px] text-brand-green font-bold">24-Hour Security Post</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-navy-900 block">Cotton Bhavan Food Court</span>
            <span className="text-[11px] text-slate-500 block">Outdoor seating canopy • 8:00 AM - 9:30 PM</span>
            <span className="text-[10px] text-brand-blue font-bold">Public Student Area</span>
          </div>
        </div>
      </div>

      {/* Verification Protocol & Privacy Shield */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-900 text-base flex items-center">
          <Lock className="w-4 h-4 mr-2 text-brand-green" />
          Indian Data Protection (DPDP) & Safeguards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-navy-900">Encrypted Storage</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Student ID cards are tokenized and stored in restricted encrypted storage.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-navy-900">Zero Public Exposure</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your identity cards are never shown to buyers, other sellers, or visible in search.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-navy-900">Fuzzy Name Reconciliation</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Spelling or initials variance between account name and ID trigger manual review, not rejection.
            </p>
          </div>
        </div>
      </div>

      {/* Verification History / Submissions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-900 text-base">Submission History</h3>
        {myRequests.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No verification documents submitted yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {myRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-900">{req.verifiedLegalName}</p>
                  <p className="text-[11px] text-slate-400">
                    {req.documentType} • Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    req.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status.toUpperCase()} ({req.nameMatchScore}% Match)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </div>
  );
}
