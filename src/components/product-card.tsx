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
    <div className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#10B981]/50 shadow-sm hover:shadow-emerald transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-[#F8FAFC] overflow-hidden border-b border-[#E2E8F0]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
        />

        {/* Primary Status Pill (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {dealScore && dealScore.grade === 'Steal Deal' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#10B981] text-[#0B1F33] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B1F33] mr-1 animate-pulse" />
              Steal Deal
            </span>
          ) : dealScore && dealScore.grade === 'Great Value' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] shadow-xs">
              Great Value
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/95 text-[#0B1F33] border border-[#E2E8F0] shadow-xs">
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
              : 'bg-white/90 text-[#64748B] hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from saved' : 'Save item'}
          aria-label={isWishlisted ? 'Remove from saved' : 'Save item'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : 'stroke-[1.8]'}`} />
        </button>

        {/* Swap Availability Tag (Bottom Left) */}
        {product.isExchangeAvailable && (
          <div className="absolute bottom-2 left-2 bg-[#0B1F33]/90 backdrop-blur-md text-[#D1FAE5] text-[10px] font-medium px-2 py-0.5 rounded flex items-center space-x-1 shadow-xs border border-[#10B981]/30">
            <Repeat className="w-2.5 h-2.5 text-[#10B981]" />
            <span>Open for Swap</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Institution */}
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
            <span className="font-semibold text-[#10B981] truncate max-w-[130px]">
              {product.categoryName}
            </span>
            <span className="flex items-center text-[#64748B] text-[11px]">
              <MapPin className="w-3 h-3 mr-0.5 text-[#10B981] shrink-0" />
              <span className="truncate max-w-[100px]">
                {product.institutionName ? product.institutionName.split(' ')[0] : 'Campus'}
              </span>
            </span>
          </div>

          {/* Title in Deep Navy with Emerald Hover */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-[#0B1F33] text-sm line-clamp-2 leading-snug group-hover:text-[#10B981] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Academic metadata (Author, Edition) */}
          {(product.author || product.edition) && (
            <p className="text-[11px] text-[#64748B] mt-1 line-clamp-1">
              {[product.author, product.edition].filter(Boolean).join(' • ')}
            </p>
          )}

          {/* Seller verification */}
          <div className="flex items-center space-x-1 mt-2 text-[11px] text-[#64748B]">
            <span className="truncate max-w-[110px] text-[#0B1F33] font-medium">
              {product.sellerName}
            </span>
            {product.sellerVerificationStatus === 'verified' && (
              <span className="inline-flex items-center text-[#047857] text-[10px] font-semibold bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]" title="Verified Student">
                <CheckCircle2 className="w-3 h-3 mr-0.5 text-[#10B981]" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Pricing Row */}
        <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold text-[#0B1F33] tracking-tight">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-[#64748B] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-[#047857] font-semibold">
                {discountPercent}% off retail
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#10B981] text-[#047857] hover:text-[#0B1F33] border border-[#A7F3D0] text-xs font-semibold transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
