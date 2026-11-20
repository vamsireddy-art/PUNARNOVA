'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal, 
  Filter, 
  X, 
  ArrowUpDown, 
  BookOpen, 
  ShieldCheck, 
  MapPin, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_CATEGORIES, MOCK_INSTITUTIONS } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';
import { ProductCondition } from '@/types';

function BuyMarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const { products, selectedCampus } = useAppStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>(selectedCampus ? selectedCampus.id : 'all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular'>('recent');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Text Search across Title, Author, ISBN, Subject, Brand, Category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesAuthor = p.author?.toLowerCase().includes(query);
        const matchesIsbn = p.isbn?.toLowerCase().includes(query);
        const matchesSubject = p.subject?.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesCat = p.categoryName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesIsbn && !matchesSubject && !matchesBrand && !matchesCat) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory && p.categoryName !== selectedCategory) {
        return false;
      }

      // 3. Condition Filter
      if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
        return false;
      }

      // 4. Institution Filter
      if (selectedInstitution !== 'all' && p.institutionId !== selectedInstitution) {
        return false;
      }

      // 5. Price Max Filter
      if (p.sellingPrice > maxPrice) {
        return false;
      }

      // 6. Distance Filter
      if ((p.distanceKm || 0) > maxDistance) {
        return false;
      }

      // 7. Verified Seller Only
      if (verifiedOnly && p.sellerVerificationStatus !== 'verified') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'popular') return b.viewCount - a.viewCount;
      // Default: recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, selectedInstitution, maxPrice, maxDistance, verifiedOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('all');
    setSelectedInstitution('all');
    setMaxPrice(3000);
    setMaxDistance(20);
    setVerifiedOnly(false);
    setSortBy('recent');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Buy Educational Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified second-hand textbooks, scientific calculators, and gear at fair student prices.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            placeholder="Search title, author, ISBN, brand, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS SIDEBAR (DESKTOP) */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-navy-900 flex items-center">
              <Filter className="w-4 h-4 mr-1.5 text-brand-blue" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-brand-blue flex items-center"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </button>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="">All 12 Categories</option>
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Condition</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              {['all', 'Like New', 'Excellent', 'Good', 'Fair', 'Needs Repair'].map((cond) => (
                <label key={cond} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                    className="text-brand-blue focus:ring-brand-blue"
                  />
                  <span>{cond === 'all' ? 'All Conditions' : cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Institution Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Institution Campus</label>
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="all">All Campuses Nationwide</option>
              {MOCK_INSTITUTIONS.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Max Price</span>
              <span className="text-brand-blue">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Max Distance Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Max Campus Distance</span>
              <span className="text-brand-blue">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 km (Hostel)</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Verified Seller Only Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-brand-blue focus:ring-brand-blue w-4 h-4"
              />
              <span className="flex items-center text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green mr-1" />
                Verified Student Sellers Only
              </span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS LISTING COLUMN */}
        <main className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Sort & Active Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="text-navy-900 font-bold">{filteredProducts.length}</span> educational items
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium flex items-center space-x-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-navy-900 focus:outline-none"
                >
                  <option value="recent">Recently Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {(selectedCategory || selectedCondition !== 'all' || verifiedOnly) && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-brand-blue font-medium">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {selectedCondition !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-brand-green font-medium">
                  Condition: {selectedCondition}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCondition('all')} />
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-50 text-purple-700 font-medium">
                  Verified Only
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setVerifiedOnly(false)} />
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">No Matching Educational Items Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, searching for another subject or book title, or reset filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function BuyMarketplacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading campus educational marketplace...</div>}>
      <BuyMarketplaceContent />
    </Suspense>
  );
}
