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
      {/* 1. HERO SECTION WITH PUNARNOVA BRAND COSMIC HORIZON THEME */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-[#071126] to-[#0a183d] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        {/* Ambient Cosmic Horizon Arc Light Effect */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-blue-600/20 to-transparent" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top User Greeting & Institution Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 tracking-wider uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Campus Peer-to-Peer Network</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {currentUser ? `Welcome back, ${currentUser.fullName.split(' ')[0]} 👋` : 'Welcome to PunarNova'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1.5 text-sky-400" />
                <span>
                  {currentUser?.institutionName
                    ? `${currentUser.institutionName} • ${currentUser.institutionType}`
                    : selectedCampus
                    ? `${selectedCampus.name} • ${selectedCampus.city || 'Campus'}`
                    : 'Discover • Reuse • Grow — Circular Economy for Students'}
                </span>
              </p>
            </div>

            {/* Geolocation status pill */}
            <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Campus Zone</p>
                <p className="text-[11px] text-slate-300">{geoMessage}</p>
              </div>
            </div>
          </div>

          {/* Main Hero Header Content */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-semibold mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>0% Platform Fees • 100% Student Verified</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Discover. Reuse. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">Grow.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Buy, sell, and swap educational textbooks, scientific calculators, and university gear with verified peers on your campus.
            </p>

            {/* PROMINENT DUAL ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-md mx-auto mb-8">
              <Link
                href="/buy"
                className="group flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-white text-navy-950 font-bold text-sm transition hover:bg-slate-100 shadow-elevated"
              >
                <ShoppingBag className="w-4 h-4 text-brand-blue" />
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/sell"
                className="group flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white font-bold text-sm transition shadow-brand border border-blue-400/30"
              >
                <PlusCircle className="w-4 h-4 text-sky-200" />
                <span>Sell with AI Price</span>
                <span className="bg-white/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  60s
                </span>
              </Link>
            </div>

            {/* Live Search Bar with Instant Suggestions */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-4">
              <input
                type="text"
                placeholder="Search by book title, author, subject, Casio model, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm pl-11 pr-28 py-3.5 rounded-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-sky-500/30 shadow-elevated transition"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Tag Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              <span className="text-[11px] text-slate-400 mr-1">Trending:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/buy?q=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-medium transition backdrop-blur-sm border border-white/5"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Trust Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto pt-6 border-t border-white/10">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">Verified Peers</p>
                <p className="text-[11px] text-slate-400">Institutional email OTP</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">0% Commission</p>
                <p className="text-[11px] text-slate-400">Direct student handover</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">AI Fair Valuation</p>
                <p className="text-[11px] text-slate-400">Smart campus pricing</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs">Book Exchange</p>
                <p className="text-[11px] text-slate-400">Swap semester courses</p>
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
                className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-blue/50 hover:shadow-elevated transition duration-200 text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-brand-blue flex items-center justify-center mb-2.5 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-navy-900 text-xs line-clamp-1 group-hover:text-brand-blue transition">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Explore items
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. CAMPUS LISTINGS / EMPTY STATE */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 tracking-tight">
                  Campus Marketplace Listings
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-owned textbooks, calculators, and instruments directly from peers
                </p>
              </div>
            </div>
            <Link href="/buy" className="text-xs font-semibold text-brand-blue hover:underline">
              See all listings →
            </Link>
          </div>

          {products.length === 0 ? (
            /* PROFESSIONAL WELCOMING EMPTY STATE WHEN DATABASE IS CLEAN */
            <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-3xl border border-blue-100 p-8 sm:p-12 text-center shadow-card relative overflow-hidden">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 text-brand-blue mx-auto flex items-center justify-center">
                  <PlusCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">
                  Ready for Your Campus Postings!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your campus marketplace is active. Be the first student to list your completed semester textbooks, scientific calculator, or lab apron!
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/sell"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition shadow-brand"
                  >
                    <Camera className="w-4 h-4" />
                    <span>List Item with AI Pricing</span>
                  </Link>
                  <Link
                    href="/exchange"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition"
                  >
                    <Repeat className="w-4 h-4 text-brand-green" />
                    <span>Propose a Book Swap</span>
                  </Link>
                </div>
              </div>

              {/* 3 Steps Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-200/80 text-left">
                <div className="p-4 rounded-xl bg-white border border-slate-200/70">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-blue text-xs font-bold flex items-center justify-center mb-2">
                    1
                  </div>
                  <h4 className="font-semibold text-navy-900 text-xs mb-1">Upload in 60s</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Snap a photo of your book or calculator. Our AI automatically extracts details and suggests fair market value.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/70">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center mb-2">
                    2
                  </div>
                  <h4 className="font-semibold text-navy-900 text-xs mb-1">Direct Student Chat</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Interested campus peers message you directly to confirm condition, syllabus edition, and meeting spot.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/70">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mb-2">
                    3
                  </div>
                  <h4 className="font-semibold text-navy-900 text-xs mb-1">Safe Hostel Handover</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Exchange item in your department or campus cafeteria. Inspect condition in person with zero shipping fees.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* 6. STUDENT EXCHANGE HIGHLIGHT BANNER */}
        <section className="bg-gradient-to-r from-navy-950 via-blue-950 to-navy-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-elevated border border-blue-800/40 relative overflow-hidden">
          <div className="space-y-3 max-w-xl relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Repeat className="w-3.5 h-3.5 text-brand-green" />
              <span>Zero-Cash Student Swap Mode</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Finished Your Semester Courses? Swap with Peers!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Don't let valuable engineering, medical, and commerce reference books collect dust. Trade your previous semester textbooks for upcoming ones with fellow classmates.
            </p>
          </div>
          <Link
            href="/exchange"
            className="px-6 py-3.5 bg-brand-green hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-soft shrink-0 relative z-10"
          >
            Explore Book Exchange →
          </Link>
        </section>
      </div>
    </div>
  );
}
