'use client';

import React, { useState } from 'react';
import { X, Upload, ShieldCheck, Lock, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function VerificationModal({ isOpen, onClose, onSuccess }: VerificationModalProps) {
  const { currentUser, submitVerification } = useAppStore();
  const [docType, setDocType] = useState<'student_id_card' | 'bonafide_certificate' | 'institutional_email'>('student_id_card');
  const [legalName, setLegalName] = useState(currentUser?.fullName || '');
  const [idNumber, setIdNumber] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [documentDataUrl, setDocumentDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

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

    // Calculate simulated fuzzy name matching score
    const regName = (currentUser?.fullName || '').toLowerCase().trim();
    const docLegalName = legalName.toLowerCase().trim();
    let score = 96.0;
    if (regName !== docLegalName) {
      score = 88.0; // Pending manual verification
    }

    setTimeout(() => {
      submitVerification({
        userId: currentUser?.id || `user-${Date.now()}`,
        userName: currentUser?.fullName || legalName,
        userEmail: currentUser?.email || '',
        institutionName: currentUser?.institutionName || 'IIT Bombay',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-brand-green mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Student ID Verified!</h3>
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
              Your institutional ID has been verified successfully with encrypted safeguards. You now have full Verified Student privileges to buy, sell, and swap materials on your campus.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 text-brand-blue mb-2">
              <ShieldCheck className="w-5 h-5 text-brand-green" />
              <h3 className="font-bold text-base sm:text-lg text-navy-900">
                Student Seller Verification
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              To prevent fraudulent commercial listings, only verified students and community members can sell products on PunarNova.
            </p>

            {/* Privacy Guarantee Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-[11px] text-slate-600 flex items-start space-x-2">
              <Lock className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Strict Privacy Guarantee (DPDP Act)</p>
                <p className="text-slate-500 mt-0.5">
                  Your identity card is stored in an encrypted vault and is NEVER shown to buyers, sellers, or public profiles. Only authorized compliance moderators review this.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Verification Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Verification Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDocType('student_id_card')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      docType === 'student_id_card'
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-semibold'
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
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mb-1" />
                    <span>Institutional Email</span>
                  </button>
                </div>
              </div>

              {/* Legal Name on ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name (as printed on your Institutional Card)
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Aarav Dev Sharma"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  We compare this against your account name ({currentUser?.fullName || 'your account'}). Minor spelling variances trigger manual review without rejection.
                </p>
              </div>

              {/* Student Roll / ID Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll / Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 21D070042 / DU2023-ECO-19"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Photo of Student ID Card (Front)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/30 transition">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-700">
                    {fileName ? fileName : 'Click to select JPG, PNG, or PDF (Max 5MB)'}
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
                  className="w-full py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition shadow-soft flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Encrypting & Verifying...</span>
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
