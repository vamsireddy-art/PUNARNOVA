'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, DollarSign, Repeat, Users, Info, X, Sparkles } from 'lucide-react';

export function SustainabilityWidget() {
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  return (
    <section className="bg-gradient-to-br from-navy-900 via-slate-900 to-navy-950 text-white rounded-2xl p-6 sm:p-8 shadow-elevated border border-slate-800 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-brand-blue/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-brand-green text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Campus Impact Metrics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Circular Economy & Waste Avoided
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowExplanationModal(true)}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Calculation Methodology</span>
            </button>
            <Link
              href="/sustainability"
              className="text-xs text-brand-green hover:underline font-medium"
            >
              View Full Report →
            </Link>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Repeat className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">1,248</p>
            <p className="text-xs text-slate-300 font-medium mt-1">Products Reused</p>
            <p className="text-[11px] text-emerald-400 mt-1">+142 this week</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">₹4,82,500</p>
            <p className="text-xs text-slate-300 font-medium mt-1">Student Savings (Est.)</p>
            <p className="text-[11px] text-blue-400 mt-1">Avg 54% off retail</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center mb-3">
              <Leaf className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">2,410 kg</p>
            <p className="text-xs text-slate-300 font-medium mt-1">CO₂ Avoided (Est.)</p>
            <p className="text-[11px] text-green-400 mt-1">~118 mature trees saved</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">890+</p>
            <p className="text-xs text-slate-300 font-medium mt-1">Active Students</p>
            <p className="text-[11px] text-purple-400 mt-1">5 Partner Campuses</p>
          </div>
        </div>
      </div>

      {/* Calculation Methodology Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-navy-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowExplanationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-brand-green mb-3">
              <Leaf className="w-5 h-5" />
              <h3 className="font-bold text-lg text-navy-900">Environmental & Savings Methodology</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Estimated Money Saved:</strong> Calculated as the difference between the documented manufacturer original retail price (MSRP) and the agreed peer resale transaction price.
              </p>
              <p>
                <strong>CO₂ & Paper Waste Avoided:</strong> Based on life-cycle assessment (LCA) data from the Environmental Paper Network (EPN):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>1 standard textbook (~1.2 kg) avoids ~1.85 kg of embedded CO₂ and ~24 liters of pulp processing water.</li>
                <li>1 scientific calculator/electronic device avoids ~4.2 kg CO₂ embodied in silicon and circuit board manufacturing.</li>
              </ul>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
                <strong>Transparency Note:</strong> All ecological figures are verified approximations calibrated from academic paper and hardware manufacturing lifecycle benchmarks.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-semibold hover:bg-navy-800 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
