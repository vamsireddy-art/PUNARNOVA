'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ProductCard } from '@/components/product-card';

export default function WishlistPage() {
  const { wishlist, products, addToCart, toggleWishlist } = useAppStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Saved Wishlist ({wishlistedProducts.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Keep track of educational textbooks and gear. Receive notifications on price reductions.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Click the heart icon on any product card to save it for later.
          </p>
          <Link
            href="/buy"
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition inline-flex items-center space-x-1.5"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
