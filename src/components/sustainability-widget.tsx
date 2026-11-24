'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, DollarSign, Repeat, Droplets, Info, X, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function SustainabilityWidget() {
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const { environmentalStats } = useAppStore();

  return (
    <section className="bg-[#0B1F33] text-white rounded-2xl p-6 sm:p-8 border border-[#132B45] shadow-elevated relative overflow-hidden">
      {/* Subtle emerald ambient gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#10B981] text-xs font-semibold tracking-wide uppercase mb-1">
              <Leaf className="w-4 h-4" />
              <span>Campus Environmental Ledger</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Circular Economy & Waste Diverted
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setShowExplanationModal(true)}
              className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-white bg-[#132B45] hover:bg-[#1E3E61] border border-[#1E3E61] px-3.5 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Info className="w-3.5 h-3.5 text-[#10B981]" />
              <span>EPN Methodology</span>
            </button>
            <Link
              href="/sustainability"
              className="inline-flex items-center space-x-1 text-[#10B981] hover:text-[#34D399] font-bold transition-colors"
            >
              <span>Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Impact Stat Cards (Dynamic from real store transactions) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#132B45]/70 border border-[#1E3E61] rounded-xl p-4 transition hover:border-[#10B981]/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium">Items Reused</span>
              <Repeat className="w-4 h-4 text-[#10B981]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {environmentalStats.totalItemsReused.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Verified exchanges & orders</p>
          </div>

          <div className="bg-[#132B45]/70 border border-[#1E3E61] rounded-xl p-4 transition hover:border-[#10B981]/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium">Student Savings</span>
              <DollarSign className="w-4 h-4 text-[#10B981]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ₹{environmentalStats.totalMoneySavedInr.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Below publisher retail price</p>
          </div>

          <div className="bg-[#132B45]/70 border border-[#1E3E61] rounded-xl p-4 transition hover:border-[#10B981]/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium">CO₂ Avoided</span>
              <Leaf className="w-4 h-4 text-[#10B981]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {environmentalStats.totalCo2AvoidedKg.toFixed(1)} <span className="text-sm font-normal text-slate-300">kg</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">1.54 kg/kg paper LCA</p>
          </div>

          <div className="bg-[#132B45]/70 border border-[#1E3E61] rounded-xl p-4 transition hover:border-[#10B981]/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium">Water Conserved</span>
              <Droplets className="w-4 h-4 text-[#34D399]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {environmentalStats.totalWaterSavedLiters.toFixed(0)} <span className="text-sm font-normal text-slate-300">L</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">26 L/kg pulp processing</p>
          </div>
        </div>
      </div>

      {/* Calculation Methodology Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowExplanationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#0B1F33] mb-3">
              <Leaf className="w-5 h-5 text-[#10B981]" />
              <h3 className="font-bold text-base text-[#0B1F33]">Life-Cycle Assessment (LCA) Standards</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong className="text-[#0B1F33]">Student Monetary Savings:</strong> Derived strictly from verified transactions by comparing publisher list MSRP with peer transaction prices.
              </p>
              <p>
                <strong className="text-[#0B1F33]">EPN Factors:</strong> Environmental factors conform to the Environmental Paper Network (EPN) lifecycle accounting:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>1.54 kg CO₂ equivalent avoided per 1 kg of paper reused.</li>
                <li>26 liters of industrial processing water conserved per 1 kg of paper reused.</li>
                <li>4.20 kg CO₂ equivalent avoided per reused electronics device.</li>
              </ul>
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#065F46] text-[11px]">
                <strong>Strict Integrity:</strong> Zero fabricated data. Figures update automatically as verified purchases and exchanges are marked completed.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-bold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
