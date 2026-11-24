'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, DollarSign, Repeat, Droplets, Info, X, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function SustainabilityWidget() {
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const { environmentalStats } = useAppStore();

  return (
    <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 border border-slate-800 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-1">
              <Leaf className="w-3.5 h-3.5" />
              <span>Campus Environmental Ledger</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Circular Economy & Waste Diverted
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setShowExplanationModal(true)}
              className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>EPN Methodology</span>
            </button>
            <Link
              href="/sustainability"
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Impact Stat Cards (Dynamic from real store transactions) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Items Reused</span>
              <Repeat className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {environmentalStats.totalItemsReused.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Verified exchanges & orders</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Student Savings</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ₹{environmentalStats.totalMoneySavedInr.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Below manufacturer retail</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">CO₂ Avoided</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {environmentalStats.totalCo2AvoidedKg.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">1.54 kg/kg paper LCA</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Water Conserved</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {environmentalStats.totalWaterSavedLiters.toFixed(0)} <span className="text-sm font-normal text-slate-400">L</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">26 L/kg pulp processing</p>
          </div>
        </div>
      </div>

      {/* Calculation Methodology Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setShowExplanationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 mb-3">
              <Leaf className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Life-Cycle Assessment (LCA) Standards</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Student Monetary Savings:</strong> Derived strictly from verified transactions by comparing publisher list MSRP with peer transaction prices.
              </p>
              <p>
                <strong>EPN Factors:</strong> Environmental factors conform to the Environmental Paper Network (EPN) lifecycle accounting:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>1.54 kg CO₂ equivalent avoided per 1 kg of paper reused.</li>
                <li>26 liters of industrial processing water conserved per 1 kg of paper reused.</li>
                <li>4.20 kg CO₂ equivalent avoided per reused electronics device.</li>
              </ul>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-[11px]">
                <strong>Strict Integrity:</strong> Zero fabricated data. Figures update automatically as verified purchases and exchanges are marked completed.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
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
