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
  Sparkles,
  Zap,
  Repeat
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';
import { calculateDealScore } from '@/lib/deal-score';

function BuyMarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const { products, selectedCampus, allInstitutions } = useAppStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>(selectedCampus ? selectedCampus.id : 'all');
  const [dealFilter, setDealFilter] = useState<'all' | 'steal_deals' | 'great_value'>('all');
  const [exchangeOnly, setExchangeOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular' | 'deal_score'>('deal_score');
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

      // 5. Deal Score Filter
      const dealScore = p.dealScore || calculateDealScore(p.sellingPrice, p.originalPrice, p.categoryName, p.condition, products);
      if (dealFilter === 'steal_deals' && dealScore.grade !== 'Steal Deal') {
        return false;
      }
      if (dealFilter === 'great_value' && (dealScore.grade !== 'Steal Deal' && dealScore.grade !== 'Great Value')) {
        return false;
      }

      // 6. Swap Available Only
      if (exchangeOnly && !p.isExchangeAvailable) {
        return false;
      }

      // 7. Price Max Filter
      if (p.sellingPrice > maxPrice) {
        return false;
      }

      // 8. Distance Filter
      if ((p.distanceKm || 0) > maxDistance) {
        return false;
      }

      // 9. Verified Seller Only
      if (verifiedOnly && p.sellerVerificationStatus !== 'verified') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'popular') return b.viewCount - a.viewCount;
      if (sortBy === 'deal_score') {
        const scoreA = (a.dealScore || calculateDealScore(a.sellingPrice, a.originalPrice, a.categoryName, a.condition, products)).scoreOutOf100;
        const scoreB = (b.dealScore || calculateDealScore(b.sellingPrice, b.originalPrice, b.categoryName, b.condition, products)).scoreOutOf100;
        return scoreB - scoreA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, selectedInstitution, dealFilter, exchangeOnly, maxPrice, maxDistance, verifiedOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('all');
    setSelectedInstitution('all');
    setDealFilter('all');
    setExchangeOnly(false);
    setMaxPrice(3000);
    setMaxDistance(20);
    setVerifiedOnly(false);
    setSortBy('deal_score');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Peer-verified educational materials, calculators, and tools with transparent ₹20 platform fee.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, ISBN, author, calculator..."
            className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] shadow-xs bg-white text-[#0B1F33] font-medium transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:block space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-[#0B1F33] text-xs flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#64748B] hover:text-[#10B981] flex items-center font-bold transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </button>
          </div>

          {/* Institution Campus Filter */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F33] mb-1.5">Campus Institution</label>
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#10B981] font-medium text-slate-800"
            >
              <option value="all">All Campuses Nationwide</option>
              {allInstitutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Deal Grade Filter */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F33] mb-1.5">Value Rating</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="flex items-center space-x-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="dealFilter"
                  checked={dealFilter === 'all'}
                  onChange={() => setDealFilter('all')}
                  className="accent-[#10B981] focus:ring-[#10B981]"
                />
                <span>All Listings</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-[#065F46] font-bold">
                <input
                  type="radio"
                  name="dealFilter"
                  checked={dealFilter === 'steal_deals'}
                  onChange={() => setDealFilter('steal_deals')}
                  className="accent-[#10B981] focus:ring-[#10B981]"
                />
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5" />
                  Steal Deals (&gt;45% off)
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-[#0B1F33] font-bold">
                <input
                  type="radio"
                  name="dealFilter"
                  checked={dealFilter === 'great_value'}
                  onChange={() => setDealFilter('great_value')}
                  className="accent-[#10B981] focus:ring-[#10B981]"
                />
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#0B1F33] mr-1.5" />
                  Great Value & Steals
                </span>
              </label>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F33] mb-1.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#10B981] font-medium text-slate-800"
            >
              <option value="">All Categories</option>
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F33] mb-1.5">Condition</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              {['all', 'Like New', 'Excellent', 'Good', 'Fair', 'Needs Repair'].map((cond) => (
                <label key={cond} className="flex items-center space-x-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                    className="accent-[#10B981] focus:ring-[#10B981]"
                  />
                  <span>{cond === 'all' ? 'All Conditions' : cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Smart Swap Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-[#0B1F33]">
              <input
                type="checkbox"
                checked={exchangeOnly}
                onChange={(e) => setExchangeOnly(e.target.checked)}
                className="rounded accent-[#10B981] focus:ring-[#10B981] w-4 h-4"
              />
              <span className="flex items-center">
                <Repeat className="w-3.5 h-3.5 text-[#10B981] mr-1.5" />
                Available for Swap
              </span>
            </label>
          </div>

          {/* Verified Seller Only Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-[#0B1F33]">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded accent-[#10B981] focus:ring-[#10B981] w-4 h-4"
              />
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] mr-1.5" />
                Verified Student Sellers
              </span>
            </label>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-[#0B1F33] mb-1">
              <span>Maximum Price</span>
              <span className="font-extrabold text-[#10B981]">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#10B981]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>₹100</span>
              <span>₹5,000</span>
            </div>
          </div>
        </aside>

        {/* PRODUCTS LISTING COLUMN */}
        <main className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Sort & Active Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-normal">
              Showing <span className="text-slate-900 font-semibold">{filteredProducts.length}</span> listings
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 flex items-center space-x-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="hidden sm:inline font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none text-navy-900"
                >
                  <option value="deal_score">Highest AI Deal Score</option>
                  <option value="recent">Recently Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Viewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-navy-900">No Listings Match Your Filters</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, searching across all campuses, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading verified campus marketplace...
      </div>
    }>
      <BuyMarketplaceContent />
    </Suspense>
  );
}
