'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Compass, 
  Flame, 
  Clock, 
  Repeat, 
  ShieldCheck,
  TrendingUp,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_CATEGORIES, MOCK_INSTITUTIONS } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';
import { SustainabilityWidget } from '@/components/sustainability-widget';
import { CampusLocationMap } from '@/components/campus-map';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, selectedCampus, setSelectedCampus, allInstitutions, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [geoDetected, setGeoDetected] = useState(false);
  const [geoMessage, setGeoMessage] = useState('Detecting approximate campus location...');

  useEffect(() => {
    // Check Geolocation permission with approximate fallback
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoDetected(true);
          setGeoMessage(`Approx. 19.1334° N, 72.9133° E (Near ${selectedCampus?.name || 'IIT Bombay'})`);
        },
        (err) => {
          setGeoDetected(true);
          setGeoMessage('Location permission defaulted to registered campus zone');
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

  // Filter products for various dashboard shelves
  const campusProducts = selectedCampus
    ? products.filter((p) => p.institutionId === selectedCampus.id)
    : products;

  const featuredProducts = campusProducts.slice(0, 4);
  const recentProducts = [...campusProducts].reverse().slice(0, 4);
  const popularProducts = [...campusProducts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);
  const nearbyProducts = [...campusProducts].filter((p) => (p.distanceKm || 0) <= 2.0).slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO SECTION & PROMINENT BUY / SELL DUAL ACTIONS */}
      <section className="relative bg-white border-b border-slate-200/80 pt-10 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top User Greeting & Institution Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue tracking-wider uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Peer Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {currentUser.fullName.split(' ')[0]} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1.5 text-slate-400" />
                <span>{currentUser.institutionName} ({currentUser.institutionType})</span>
              </p>
            </div>

            {/* Geolocation status pill */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Campus Proximity Radar</p>
                <p className="text-[11px] text-slate-500">{geoMessage}</p>
              </div>
            </div>
          </div>

          {/* Core Call-to-Action Hero Box */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
              PunarNova: Smart Campus Reuse. <br />
              <span className="text-brand-blue">
                Save Money & Displace Educational Waste.
              </span>
            </h2>
            <p className="text-sm text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified students at your campus to buy, sell, and exchange textbooks, calculators, and lab gear with 0% commission.
            </p>

            {/* PROMINENT BUY & SELL BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-md mx-auto mb-8">
              <Link
                href="/buy"
                className="group flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                <span>BUY PRODUCTS</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/sell"
                className="group flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>SELL PRODUCT</span>
                <span className="bg-white/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  AI Pricing
                </span>
              </Link>
            </div>

            {/* Live Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search by book title, author, subject, Casio model, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm pl-11 pr-28 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-4 py-1.5 bg-brand-blue hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* LEAFLET AUTOMATIC CAMPUS LOCATION MAP */}
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
              <h2 className="text-lg sm:text-xl font-bold text-navy-900 tracking-tight">
                Explore by Category
              </h2>
              <p className="text-xs text-slate-500">
                12 specialized educational categories tailored for schools & universities
              </p>
            </div>
            <Link href="/buy" className="text-xs font-semibold text-brand-blue hover:underline flex items-center">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/buy?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-blue/50 hover:shadow-soft transition text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-brand-blue flex items-center justify-center mb-2 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-navy-900 text-xs line-clamp-1 group-hover:text-brand-blue transition">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {cat.itemCount || 20}+ items
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. FEATURED PRODUCTS SHELF */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-navy-900 tracking-tight">
                  Featured Campus Listings
                </h2>
                <p className="text-xs text-slate-500">
                  Curated top condition items with verified student sellers
                </p>
              </div>
            </div>
            <Link href="/buy" className="text-xs font-semibold text-brand-blue hover:underline">
              See more →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* 6. NEARBY & POPULAR PRODUCTS SHELVES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Nearby Section */}
          <div className="bg-slate-100/60 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-navy-900 text-base">Within Walking Distance (&lt; 2km)</h3>
              </div>
              <span className="text-xs text-slate-500">Direct Hostel Handover</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nearbyProducts.slice(0, 2).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Popular Section */}
          <div className="bg-slate-100/60 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-navy-900 text-base">High Demand Educational Gear</h3>
              </div>
              <span className="text-xs text-slate-500">Most Viewed</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularProducts.slice(0, 2).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* 7. STUDENT EXCHANGE HIGHLIGHT BANNER */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold">
              <Repeat className="w-3.5 h-3.5 text-brand-green" />
              <span>Zero Cash Barter Mode</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Want to Swap Textbooks Instead of Selling?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Exchange your completed semester course books for upcoming semester subjects directly with peers in your department.
            </p>
          </div>
          <Link
            href="/exchange"
            className="px-6 py-3 bg-brand-green hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-soft shrink-0"
          >
            Explore Book Exchange →
          </Link>
        </section>
      </div>
    </div>
  );
}
