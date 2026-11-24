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
        <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#10B981] mx-auto flex items-center justify-center border border-[#A7F3D0]">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-[#0B1F33]">Sign In to Access Verification</h2>
        <p className="text-xs text-[#64748B]">
          Please sign in to view your student verification status or submit your student ID card.
        </p>
        <Link
          href="/auth/signin"
          className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black inline-block transition shadow-emerald"
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Institutional Verification</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Student Seller Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Verified student accounts protect peers and ensure physical campus transactions remain trusted.
        </p>
      </div>

      {/* Current Status Card */}
      <div className={`p-5 rounded-xl border ${currentStatusConfig.color} shadow-xs space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/90 flex items-center justify-center shrink-0 border border-current/20">
              <StatusIcon className="w-5 h-5 text-current" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-75">
                Current Verification Status
              </span>
              <h2 className="text-lg font-bold">{currentStatusConfig.label}</h2>
              <p className="text-xs opacity-80 mt-0.5">
                {currentUser.fullName} • {currentUser.institutionName || 'Aditya University'}
              </p>
            </div>
          </div>

          {effectiveVerificationStatus !== 'verified' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black text-xs rounded-xl transition shadow-emerald shrink-0"
            >
              {effectiveVerificationStatus === 'pending' ? 'Update Documents' : 'Submit Student ID'}
            </button>
          )}
        </div>
      </div>

      {/* Official Safe Handover Spots on Your Campus */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm">Designated Safe Handover Zones</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {currentUser.institutionName || 'Aditya University'}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          To ensure personal safety, meet only at institution-monitored locations. Handover arrangements are officially designated at:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 block">Central Campus Library Foyer</span>
            <span className="text-[11px] text-slate-500 block">Ground floor turnstiles • 9:00 AM - 7:00 PM</span>
            <span className="text-[10px] text-emerald-700 font-medium">Staffed Zone</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 block">Student Activity Center (SAC)</span>
            <span className="text-[11px] text-slate-500 block">Lobby reception • 10:00 AM - 8:00 PM</span>
            <span className="text-[10px] text-emerald-700 font-medium">Staffed Zone</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 block">Main Campus Security Gate #1</span>
            <span className="text-[11px] text-slate-500 block">Visitor registration desk • 24 Hours staffed</span>
            <span className="text-[10px] text-emerald-700 font-medium">24-Hour Security Post</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 block">Cotton Bhavan Cafeteria Canopy</span>
            <span className="text-[11px] text-slate-500 block">Outdoor common area • 8:00 AM - 9:30 PM</span>
            <span className="text-[10px] text-blue-700 font-medium">Monitored Public Area</span>
          </div>
        </div>
      </div>

      {/* Verification Protocol & Privacy Shield */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center">
          <Lock className="w-4 h-4 mr-2 text-emerald-600" />
          Data Protection & Privacy Safeguards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-semibold text-slate-900">Restricted Storage</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Student ID documents are restricted and only accessible to verified administrators for identity checks.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-semibold text-slate-900">Zero Public Exposure</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Personal roll numbers and document scans are never displayed publicly on listings or shared with peers.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-semibold text-slate-900">Institutional Email OTP</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Official college email domains are authenticated to guarantee student enrollment validity.
            </p>
          </div>
        </div>
      </div>

      {/* Verification History / Submissions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Submission History</h3>
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
