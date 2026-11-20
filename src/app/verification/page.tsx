'use client';

import React, { useState } from 'react';
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
  const { currentUser, verifications } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  const myRequests = verifications.filter((v) => v.userId === currentUser.id);

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

  const currentStatusConfig = statusConfigs[currentUser.verificationStatus] || statusConfigs.not_verified;
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
      <div className={`p-6 rounded-2xl border ${currentStatusConfig.color} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
              <StatusIcon className="w-6 h-6 text-current" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                Your Seller Verification Status
              </span>
              <h2 className="text-xl font-bold">{currentStatusConfig.label}</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Account: {currentUser.fullName} ({currentUser.institutionName})
              </p>
            </div>
          </div>

          {currentUser.verificationStatus !== 'verified' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition shadow-soft shrink-0"
            >
              {currentUser.verificationStatus === 'pending' ? 'Update Documents' : 'Submit Student ID'}
            </button>
          )}
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
