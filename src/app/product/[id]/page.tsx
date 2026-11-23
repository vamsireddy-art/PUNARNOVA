'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Tag, 
  Zap,
  Repeat,
  AlertTriangle,
  Lock,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ProductCard } from '@/components/product-card';
import { ChatModal } from '@/components/chat-modal';
import { ReportModal } from '@/components/report-modal';
import { calculateDealScore } from '@/lib/deal-score';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products, addToCart, wishlist, toggleWishlist, currentUser, allInstitutions } = useAppStore();
  const product = products.find((p) => p.id === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">This educational listing may have been sold or removed.</p>
        <Link href="/buy" className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-semibold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100
  );
  const similarProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  // Dynamic AI Deal Score
  const dealScore = product.dealScore || calculateDealScore(
    product.sellingPrice,
    product.originalPrice,
    product.categoryName,
    product.condition,
    products
  );

  // Institution safe handover spots
  const matchingInst = allInstitutions.find(
    (i) => i.id === product.institutionId || i.name.toLowerCase() === product.institutionName.toLowerCase()
  );
  const safeSpot = matchingInst?.safeHandoverSpots.find((s) => s.id === product.pickupSpotId) || matchingInst?.safeHandoverSpots[0];

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Link href="/buy" className="hover:text-brand-blue flex items-center font-medium">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Marketplace</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">{product.categoryName}</span>
          <span>/</span>
          <span className="text-navy-900 font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="text-slate-400 hover:text-rose-600 transition flex items-center space-x-1 font-medium"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Listing</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.status === 'sold' && (
              <div className="absolute inset-0 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center">
                <span className="px-5 py-2.5 bg-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-elevated">
                  SOLD TO CAMPUS PEER
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    activeImageIndex === idx ? 'border-brand-blue ring-2 ring-brand-blue/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* AI Deal Score & Valuation Card */}
          <div className="p-5 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-3xl text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-brand-blue font-extrabold">
                <Zap className="w-4 h-4 text-brand-green fill-current" />
                <span>AI Deal Score: {dealScore.scoreOutOf100}/100 ({dealScore.grade})</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-blue text-white">
                {dealScore.percentageBelowMedian}% Below Campus Median
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {dealScore.assessmentNote}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-blue-100">
              <span>Category Median: ₹{dealScore.categoryMedianPrice}</span>
              <span>Condition Diagnosed: {product.condition}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          {/* Category & Status */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100">
              {product.categoryName}
            </span>
            <span className="text-xs text-slate-500 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Listed on {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
            {product.title}
          </h1>

          {/* Price Breakdown Card */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-navy-900">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-rose-100 text-rose-700 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                    {discountPercent}% SAVINGS
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-emerald-700 font-semibold flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1" />
              You save ₹{(product.originalPrice - product.sellingPrice).toLocaleString('en-IN')} compared to original purchase price
            </p>
          </div>

          {/* Academic Specifications Table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Condition</span>
              <span className="font-bold text-navy-900">{product.condition}</span>
            </div>
            {product.edition && (
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Edition</span>
                <span className="font-bold text-navy-900">{product.edition}</span>
              </div>
            )}
            {product.author && (
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Author(s)</span>
                <span className="font-bold text-navy-900 line-clamp-1">{product.author}</span>
              </div>
            )}
            {product.isbn && (
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">ISBN</span>
                <span className="font-bold text-navy-900 font-mono text-[11px]">{product.isbn}</span>
              </div>
            )}
            {product.subject && (
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Subject / Course</span>
                <span className="font-bold text-navy-900">{product.subject}</span>
              </div>
            )}
            {product.semester && (
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Semester</span>
                <span className="font-bold text-navy-900">{product.semester}</span>
              </div>
            )}
          </div>

          {/* Official Campus Safe Handover Spot */}
          {safeSpot && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span>Recommended Campus Handover Zone: {safeSpot.name}</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Landmark: {safeSpot.landmark} • Staffed Hours: {safeSpot.timing}. Safe peer handovers protect student privacy.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200">
              {product.description}
            </p>
          </div>

          {/* Smart Swap Wanted Note */}
          {product.isExchangeAvailable && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                <Repeat className="w-4 h-4 text-indigo-600" />
                <span>Seller Wants to Swap with:</span>
              </div>
              <p className="text-xs text-indigo-800">
                {product.exchangeWantedNotes || 'Open to relevant course materials or previous semester textbooks.'}
              </p>
              <Link
                href={`/exchange?target=${product.id}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline pt-1"
              >
                <span>Propose an Exchange with Your Items →</span>
              </Link>
            </div>
          )}

          {/* Seller Profile Card */}
          <div className="p-4 bg-white border border-slate-200 rounded-3xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={product.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={product.sellerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-navy-900 text-sm">{product.sellerName}</span>
                  {product.sellerVerificationStatus === 'verified' && (
                    <span className="inline-flex items-center text-brand-green text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified Student
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-brand-blue" />
                  {product.institutionName}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <MessageSquare className="w-4 h-4 text-brand-blue" />
              <span>Chat / Offer</span>
            </button>
          </div>

          {/* PRIMARY PURCHASE ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'sold'}
              className="py-3.5 px-4 bg-white hover:bg-slate-50 text-navy-900 border-2 border-slate-300 hover:border-brand-blue font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-brand-green" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.status === 'sold'}
              className="py-3.5 px-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-soft disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now (Campus Handover)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Similar Listings Carousel / Row */}
      {similarProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <h2 className="text-xl font-extrabold text-navy-900">Similar Materials from Campus Peers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        product={product}
      />

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={isReportOpen}
        product={product}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
