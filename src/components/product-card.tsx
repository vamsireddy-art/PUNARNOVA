'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useAppStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100
  );

  const conditionColors: Record<string, string> = {
    'Like New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Excellent': 'bg-blue-50 text-blue-700 border-blue-200',
    'Good': 'bg-amber-50 text-amber-700 border-amber-200',
    'Fair': 'bg-orange-50 text-orange-700 border-orange-200',
    'Needs Repair': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Condition Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm shadow-sm ${
              conditionColors[product.condition] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {product.condition}
          </span>
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
        </button>

        {/* AI Estimation Badge if applied */}
        {product.aiConfidenceScore && (
          <div className="absolute bottom-2 left-2 bg-navy-900/85 backdrop-blur-md text-slate-200 text-[10px] px-2 py-0.5 rounded-md flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5 text-brand-green" />
            <span>AI Verified Fair Price</span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Campus */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-medium text-brand-blue truncate max-w-[130px]">
              {product.categoryName}
            </span>
            <span className="flex items-center text-slate-500">
              <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
              {product.distanceKm !== undefined ? `${product.distanceKm} km` : 'Campus'}
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-brand-blue transition">
            <h3 className="font-semibold text-navy-900 text-sm line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Seller Status */}
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-slate-600">
            <span className="truncate max-w-[110px] font-medium text-slate-700">
              {product.sellerName}
            </span>
            {product.sellerVerificationStatus === 'verified' && (
              <span className="inline-flex items-center text-brand-green text-[10px] font-medium bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100" title="Verified Student at Institution">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-bold text-navy-900">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              Save ₹{(product.originalPrice - product.sellingPrice).toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-blue hover:text-white text-navy-900 text-xs font-semibold transition"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
