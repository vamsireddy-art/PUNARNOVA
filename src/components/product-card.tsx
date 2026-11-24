'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, CheckCircle2, Repeat, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useAppStore } from '@/lib/store';
import { calculateDealScore } from '@/lib/deal-score';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, products } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100
  );

  // Compute or use real-time AI Deal Score
  const dealScore = product.dealScore || calculateDealScore(
    product.sellingPrice,
    product.originalPrice,
    product.categoryName,
    product.condition,
    products
  );

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />

        {/* Primary Status Pill (Top Left) - Single, high-priority badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {dealScore && dealScore.grade === 'Steal Deal' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse" />
              Steal Deal
            </span>
          ) : dealScore && dealScore.grade === 'Great Value' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-600 text-white shadow-xs">
              Great Value
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/95 text-slate-700 border border-slate-200/90 shadow-xs backdrop-blur-xs">
              {product.condition}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-xs ${
            isWishlisted
              ? 'bg-white text-rose-600'
              : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from saved' : 'Save item'}
          aria-label={isWishlisted ? 'Remove from saved' : 'Save item'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : 'stroke-[1.8]'}`} />
        </button>

        {/* Swap Availability Tag (Bottom Left) */}
        {product.isExchangeAvailable && (
          <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center space-x-1 shadow-xs">
            <Repeat className="w-2.5 h-2.5 text-blue-300" />
            <span>Open for Swap</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Institution */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-medium text-slate-500 truncate max-w-[130px]">
              {product.categoryName}
            </span>
            <span className="flex items-center text-slate-500 text-[11px]">
              <MapPin className="w-3 h-3 mr-0.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[100px]">
                {product.institutionName ? product.institutionName.split(' ')[0] : 'Campus'}
              </span>
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Academic metadata (Author, Edition) */}
          {(product.author || product.edition) && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {[product.author, product.edition].filter(Boolean).join(' • ')}
            </p>
          )}

          {/* Seller verification */}
          <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-600">
            <span className="truncate max-w-[110px] text-slate-700">
              {product.sellerName}
            </span>
            {product.sellerVerificationStatus === 'verified' && (
              <span className="inline-flex items-center text-emerald-700 text-[10px] font-medium bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100" title="Verified Institutional Student">
                <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Pricing Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-700 font-medium">
                {discountPercent}% below retail
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
