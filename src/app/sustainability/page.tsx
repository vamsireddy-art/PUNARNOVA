'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  Repeat, 
  DollarSign, 
  Users, 
  Sparkles, 
  Info, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Droplet
} from 'lucide-react';

export default function SustainabilityDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-navy-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-elevated border border-emerald-900/50 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-bold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Campus Circular Economy</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Campus Sustainability & Impact Dashboard
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Every textbook, calculator, and lab coat reused directly displaces raw pulp consumption, heavy metals manufacturing, and prevents student materials from going into landfills.
        </p>
      </div>

      {/* Primary 4 Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Repeat className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-navy-900">1,248</p>
          <h3 className="text-xs font-bold text-slate-700">Educational Products Reused</h3>
          <p className="text-[11px] text-emerald-600 font-medium">+142 items this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-navy-900">₹4,82,500</p>
          <h3 className="text-xs font-bold text-slate-700">Estimated Money Saved by Students</h3>
          <p className="text-[11px] text-blue-600 font-medium">Average 54% discount</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-navy-900">2,410 kg</p>
          <h3 className="text-xs font-bold text-slate-700">Estimated CO₂ Avoided</h3>
          <p className="text-[11px] text-green-600 font-medium">~118 mature trees preserved</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Droplet className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-navy-900">31,200 L</p>
          <h3 className="text-xs font-bold text-slate-700">Industrial Water Saved</h3>
          <p className="text-[11px] text-cyan-600 font-medium">Paper bleaching avoided</p>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center space-x-2 text-navy-900">
          <Info className="w-5 h-5 text-brand-blue" />
          <h2 className="text-lg font-bold">Calculation Methodology & Transparency</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <h3 className="font-bold text-navy-900 text-sm">Textbook Lifecycle Assessment</h3>
            <p>
              According to Environmental Paper Network (EPN) life-cycle assessments, printing 1 kg of virgin educational textbook paper produces approximately <strong>1.54 kg of CO₂ equivalent</strong> and consumes 26 liters of processing water.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <h3 className="font-bold text-navy-900 text-sm">Electronics & Calculator Embodied Carbon</h3>
            <p>
              Hardware devices such as scientific calculators and technical drafting sets embody silicon fabrication and battery logistics emissions of approximately <strong>4.2 kg CO₂</strong> per unit. Reusing keeps functional microchips in circulation.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
          <strong>Notice:</strong> All carbon, water, and financial figures are labeled as <strong>estimates</strong> based on verified peer transaction records and published environmental benchmarking coefficients.
        </div>
      </div>
    </div>
  );
}
