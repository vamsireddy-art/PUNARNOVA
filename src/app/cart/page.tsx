'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useAppStore();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );
  const deliveryFee = 0; // Campus handover has 0 delivery fee for students!
  const platformFee = 0; // 0% commission for peer student reuse
  const totalAmount = subtotal + deliveryFee;

  const hasSoldItems = cart.some((item) => item.product.status === 'sold');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your selected educational items before campus handover checkout.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:underline flex items-center"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear Cart
          </button>
        )}
      </div>

      {hasSoldItems && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>One or more items in your cart have already been sold. Please remove them to proceed.</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">Your Cart is Currently Empty</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Explore textbooks, scientific calculators, and lab tools listed by students at your campus.
          </p>
          <Link
            href="/buy"
            className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black transition inline-flex items-center space-x-1.5 shadow-emerald"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                        {item.product.categoryName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Condition: {item.product.condition}
                      </span>
                    </div>

                    <h3 className="font-bold text-navy-900 text-sm mt-1 line-clamp-1">
                      {item.product.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      Seller: {item.product.sellerName} ({item.product.institutionName})
                    </p>

                    {item.product.status === 'sold' && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Item Sold - Please Remove
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Quantity Controls */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                  <div className="text-right">
                    <p className="text-base font-extrabold text-navy-900">
                      ₹{(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ₹{item.product.sellingPrice} each
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
            <h2 className="font-extrabold text-navy-900 text-base pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''}):</span>
                <span className="font-semibold text-navy-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Campus Peer Handover Fee:</span>
                <span className="font-semibold text-emerald-600">FREE (₹0)</span>
              </div>

              <div className="flex justify-between">
                <span>Student Platform Fee:</span>
                <span className="font-semibold text-emerald-600">0% Commission</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-navy-900">
                <span>Total Amount:</span>
                <span className="text-[#10B981] text-base font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[11px] text-[#065F46] space-y-1">
              <div className="flex items-center font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981] mr-1" />
                <span>Zero Risk Campus Handover</span>
              </div>
              <p className="text-slate-600 leading-tight">
                Funds are held in escrow until you verify the physical item condition on campus.
              </p>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              disabled={hasSoldItems}
              className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black transition shadow-emerald flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
