'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';
import { useAppStore } from '@/lib/store';

interface ReportModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
}

export function ReportModal({ isOpen, product, onClose }: ReportModalProps) {
  const { currentUser, reportProduct, blockUser } = useAppStore();
  const [reason, setReason] = useState<'counterfeit' | 'overpriced' | 'inappropriate' | 'misleading_condition' | 'prohibited_item' | 'other'>('misleading_condition');
  const [description, setDescription] = useState('');
  const [shouldBlockSeller, setShouldBlockSeller] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportProduct({
      productId: product.id,
      productTitle: product.title,
      reporterId: currentUser?.id || 'anonymous_student',
      reporterName: currentUser?.fullName || 'Campus Peer',
      reason,
      description,
    });

    if (shouldBlockSeller) {
      blockUser(product.sellerId);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-extrabold text-navy-900 text-base">
              Report Listing or Safety Concern
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-brand-green mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-navy-900 text-sm">Report Submitted to Campus Moderator</h4>
            <p className="text-xs text-slate-500">
              Our safety compliance desk investigates flagged listings to ensure campus trust and safety.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-slate-800 line-clamp-1">{product.title}</p>
              <p className="text-[11px] text-slate-400">Seller: {product.sellerName} ({product.institutionName})</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e: any) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue bg-white text-slate-700 font-medium"
              >
                <option value="misleading_condition">Misrepresented Condition (Damages omitted)</option>
                <option value="counterfeit">Pirated Photocopy / Unlicensed Reprint</option>
                <option value="overpriced">Excessive Commercial Price Gouging</option>
                <option value="prohibited_item">Non-Educational / Prohibited Campus Item</option>
                <option value="inappropriate">Inappropriate, Offensive, or Harassing Content</option>
                <option value="other">Other Campus Violation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Details & Evidence</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is inaccurate or unsafe about this listing..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-xs text-slate-800"
              />
            </div>

            <label className="flex items-center space-x-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={shouldBlockSeller}
                onChange={(e) => setShouldBlockSeller(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-[11px] font-medium text-slate-700">
                Also block this seller from sending me chat messages and swap offers
              </span>
            </label>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-soft flex items-center space-x-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
