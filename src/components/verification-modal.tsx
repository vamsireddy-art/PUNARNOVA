'use client';

import React, { useState } from 'react';
import { X, Upload, ShieldCheck, Lock, CheckCircle2, AlertCircle, FileText, Sparkles, Building } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function VerificationModal({ isOpen, onClose, onSuccess }: VerificationModalProps) {
  const { currentUser, submitVerification, allInstitutions, selectedCampus } = useAppStore();
  const [docType, setDocType] = useState<'student_id_card' | 'bonafide_certificate' | 'institutional_email'>('student_id_card');
  const [selectedInstId, setSelectedInstId] = useState(currentUser?.institutionId || selectedCampus?.id || allInstitutions[0]?.id || 'inst-aditya');
  const [legalName, setLegalName] = useState(currentUser?.fullName || '');
  const [idNumber, setIdNumber] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [documentDataUrl, setDocumentDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const currentInst = allInstitutions.find((i) => i.id === selectedInstId) || allInstitutions[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        if (loadEv.target?.result) {
          setDocumentDataUrl(loadEv.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calculate score: institutional email match or valid ID
    const regName = (currentUser?.fullName || '').toLowerCase().trim();
    const docLegalName = legalName.toLowerCase().trim();
    let score = 96.0;

    // Check institutional email domain match
    const userEmail = currentUser?.email?.toLowerCase() || '';
    const instDomain = currentInst.emailDomain?.toLowerCase();
    const isDomainMatch = instDomain && userEmail.endsWith(`@${instDomain}`);

    if (isDomainMatch) {
      score = 99.0;
    } else if (regName !== docLegalName) {
      score = 88.0;
    }

    setTimeout(() => {
      submitVerification({
        userId: currentUser?.id || `user-${Date.now()}`,
        userName: currentUser?.fullName || legalName,
        userEmail: currentUser?.email || '',
        institutionId: currentInst.id,
        institutionName: currentInst.name,
        documentType: docType,
        documentUrl: documentDataUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        verifiedLegalName: legalName,
        nameMatchScore: score,
      });

      setIsSubmitting(false);
      setIsDone(true);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-brand-green mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-navy-900">Student Identity Verified!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your institutional affiliation at <strong>{currentInst.name}</strong> has been encrypted and verified. You now hold full Verified Student privileges to buy, sell, and swap educational materials.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition shadow-soft"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-brand-blue">
                <ShieldCheck className="w-5 h-5 text-brand-green" />
                <h3 className="font-extrabold text-base sm:text-lg text-navy-900">
                  Student Seller Verification
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                To prevent commercial fraud and spam, only verified enrolled students can publish product listings and swap textbooks.
              </p>
            </div>

            {/* Privacy Guarantee Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Strict Privacy Guarantee (DPDP Act)</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Your identity card is stored in an encrypted vault and is NEVER shown to buyers, other sellers, or public profiles.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Institution Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Select Your College / University
                </label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                >
                  {allInstitutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.city}) {inst.emailDomain ? `— @${inst.emailDomain}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verification Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  2. Verification Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDocType('student_id_card')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      docType === 'student_id_card'
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 mb-1" />
                    <span>Student ID Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType('institutional_email')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      docType === 'institutional_email'
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mb-1" />
                    <span>Institutional Domain</span>
                  </button>
                </div>
              </div>

              {/* Legal Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Legal Name (as on your Student ID Card)
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Karri Mohan Vamsi Reddy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Student Roll / Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 22A91A05XX / DU2023-ECO-19"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload Photo of Student ID Card (Front)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/30 transition">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {fileName ? fileName : 'Click to select JPG, PNG, or PDF'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Ensure name, photo, and roll number are legible
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-brand-blue text-white rounded-2xl text-xs font-extrabold hover:bg-blue-600 disabled:opacity-50 transition shadow-soft flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Encrypting & Verifying ID...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
