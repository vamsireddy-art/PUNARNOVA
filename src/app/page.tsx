'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  PlusCircle, 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Flame, 
  Repeat, 
  ShieldCheck,
  GraduationCap,
  Zap,
  TrendingDown,
  Users,
  Camera,
  Coins
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';
import { SustainabilityWidget } from '@/components/sustainability-widget';
import { CampusLocationMap } from '@/components/campus-map';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, selectedCampus, setSelectedCampus, allInstitutions, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [geoMessage, setGeoMessage] = useState('Detecting approximate campus location...');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setGeoMessage(`Campus Radar: Near ${selectedCampus?.name || 'Your University'}`);
        },
        () => {
          setGeoMessage(`Campus Radar: ${selectedCampus?.name || 'Verified Campus Partner'}`);
        },
        { timeout: 3000 }
      );
    }
  }, [selectedCampus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buy?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickTags = [
    'Engineering Books',
    'Scientific Calculator',
    'Medical Anatomy',
    'NCERT',
    'GATE / GRE Prep',
    'Drafting Tools',
  ];

  // Filter products for various dashboard shelves
  const campusProducts = selectedCampus
    ? products.filter((p) => p.institutionId === selectedCampus.id)
    : products;

  const featuredProducts = campusProducts.slice(0, 4);
  const recentProducts = [...campusProducts].reverse().slice(0, 4);
  const popularProducts = [...campusProducts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);
  const nearbyProducts = [...campusProducts].filter((p) => (p.distanceKm || 0) <= 2.0).slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO SECTION WITH CLEAN EXECUTIVE SLATE DESIGN */}
      <section className="relative bg-slate-950 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top User Greeting & Institution Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center space-x-2 text-xs font-medium text-emerald-400 tracking-wide uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Verified Peer-to-Peer Network</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {currentUser ? `Welcome back, ${currentUser.fullName}` : 'PunarNova Campus Marketplace'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1.5 text-slate-400" />
                <span>
                  {currentUser?.institutionName
                    ? `${currentUser.institutionName} • ${currentUser.institutionType}`
                    : selectedCampus
                    ? `${selectedCampus.name} • ${selectedCampus.city || 'Campus'}`
                    : 'Institutional Textbook & Academic Equipment Exchange'}
                </span>
              </p>
            </div>

            {/* Geolocation status pill */}
            <div className="flex items-center space-x-2.5 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-medium text-white text-xs">Active Campus Zone</p>
                <p className="text-[11px] text-slate-400">{geoMessage}</p>
              </div>
            </div>
          </div>

          {/* Main Hero Header Content */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              The Verified Campus Marketplace.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Buy, sell, and swap educational textbooks, scientific calculators, and university essentials directly with verified peers. 0% platform commission.
            </p>

            {/* PRIMARY DUAL ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8">
              <Link
                href="/buy"
                className="group flex items-center justify-center space-x-2 px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold text-sm transition-colors hover:bg-slate-100 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-slate-900" />
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/sell"
                className="group flex items-center justify-center space-x-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Listing</span>
              </Link>
            </div>

            {/* Live Search Bar with Instant Suggestions */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-4">
              <input
                type="text"
                placeholder="Search by title, author, subject, Casio model, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm pl-11 pr-24 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xs transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Tag Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Trending:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/buy?q=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition-colors border border-slate-800"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Trust Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">Verified Peers</p>
                <p className="text-[11px] text-slate-400">Institutional email OTP</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">0% Commission</p>
                <p className="text-[11px] text-slate-400">Direct student handover</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">Fair Valuation</p>
                <p className="text-[11px] text-slate-400">Data-backed pricing</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <Repeat className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">Smart Swap</p>
                <p className="text-[11px] text-slate-400">Semester barter matching</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* LEAFLET CAMPUS LOCATION MAP */}
        <section>
          <CampusLocationMap
            selectedCampus={selectedCampus}
            onCampusSelect={(campus) => setSelectedCampus(campus)}
            allCampuses={allInstitutions}
          />
        </section>

        {/* 3. SUSTAINABILITY WIDGET */}
        <SustainabilityWidget />

        {/* 4. EDUCATIONAL CATEGORIES GRID */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-navy-900 tracking-tight">
                Explore by Academic Category
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specialized educational gear organized for universities and colleges
              </p>
            </div>
            <Link 
              href="/buy" 
              className="text-xs font-semibold text-brand-blue hover:text-blue-700 transition flex items-center group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/buy?category=${encodeURIComponent(cat.name)}`}
                className="group p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-150 text-center flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-slate-100 text-slate-700 flex items-center justify-center mb-2 transition-colors">
                  <BookOpen className="w-4 h-4 stroke-[1.8]" />
                </div>
                <h3 className="font-semibold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Browse
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. CAMPUS LISTINGS / EMPTY STATE */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured Campus Listings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-owned textbooks, calculators, and instruments from verified peers
              </p>
            </div>
            <Link href="/buy" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center group">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {products.length === 0 ? (
            /* PROFESSIONAL WELCOMING EMPTY STATE WHEN DATABASE IS CLEAN */
            <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  No Active Listings Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Your campus network is open. Be the first student to list your completed semester textbooks, scientific calculator, or drawing gear.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/sell"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Post a Listing</span>
                  </Link>
                  <Link
                    href="/exchange"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs sm:text-sm transition-colors"
                  >
                    <Repeat className="w-4 h-4 text-emerald-600" />
                    <span>Propose a Swap</span>
                  </Link>
                </div>
              </div>

              {/* 3 Steps Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-left">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-900 block mb-1">1. Photo & Scan</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Capture book ISBN or cover. Valuation algorithms benchmark comparable sales instantly.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-900 block mb-1">2. Peer Messaging</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Connect directly with verified students on campus to agree on condition and details.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-900 block mb-1">3. Safe Handover</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Meet at designated campus security gates or library foyers with 0% shipping costs.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* 6. STUDENT EXCHANGE HIGHLIGHT BANNER */}
        <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <Repeat className="w-3.5 h-3.5" />
              <span>Direct Barter Mode</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Course Completed? Swap Books with Peers.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Exchange previous semester reference manuals, notes, and lab records for upcoming courses without out-of-pocket expenses.
            </p>
          </div>
          <Link
            href="/exchange"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors shadow-xs shrink-0"
          >
            Open Smart Swap →
          </Link>
        </section>
      </div>
    </div>
  );
}
