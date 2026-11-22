'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Repeat, 
  ArrowRightLeft, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  MessageSquare,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ProductExchange, Product } from '@/types';

export default function ExchangeMarketplacePage() {
  const { products, currentUser } = useAppStore();
  const exchangeableProducts = products.filter((p) => p.isExchangeAvailable);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetProduct, setSelectedTargetProduct] = useState<Product | null>(null);
  const [myOfferedProductTitle, setMyOfferedProductTitle] = useState('');
  const [exchangeNote, setExchangeNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [activeExchanges, setActiveExchanges] = useState<ProductExchange[]>([]);

  const handleProposeSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetProduct || !myOfferedProductTitle.trim()) return;

    const newExchange: ProductExchange = {
      id: `ex-${Date.now()}`,
      requesterId: currentUser?.id || 'guest',
      requesterName: currentUser?.fullName || 'Student',
      offeredProduct: {
        id: `offered-${Date.now()}`,
        sellerId: currentUser?.id || 'guest',
        sellerName: currentUser?.fullName || 'Student',
        sellerVerificationStatus: currentUser?.verificationStatus || 'not_verified',
        institutionId: currentUser?.institutionId || 'inst-1',
        institutionName: currentUser?.institutionName || 'Campus Partner',
        categoryId: 'cat-exchange',
        categoryName: 'Books & Coursework',
        title: myOfferedProductTitle.trim(),
        description: exchangeNote,
        brand: 'Academic',
        condition: 'Good',
        originalPrice: 500,
        sellingPrice: 0,
        images: [],
        status: 'available',
        isNegotiable: false,
        isExchangeAvailable: true,
        deliveryAvailable: false,
        viewCount: 0,
        wishlistCount: 0,
        createdAt: new Date().toISOString(),
      },
      targetProduct: selectedTargetProduct,
      ownerId: selectedTargetProduct.sellerId,
      ownerName: selectedTargetProduct.sellerName,
      status: 'proposed',
      notes: exchangeNote || 'Direct book exchange proposed',
      createdAt: new Date().toISOString(),
    };

    setActiveExchanges([newExchange, ...activeExchanges]);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedTargetProduct(null);
      setMyOfferedProductTitle('');
      setExchangeNote('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-bold">
            <Repeat className="w-3.5 h-3.5" />
            <span>Campus Barter & Swaps</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Student-to-Student Educational Exchange
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a course textbook for next semester? Swap with peers on your campus for <strong>₹0 cash exchange</strong>. Keep educational materials circulating freely.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-xs space-y-2 shrink-0">
          <p className="font-bold text-white flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-green" />
            How Peer Exchange Works:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
            <li>Find an item marked "Exchange Available"</li>
            <li>Propose your available educational book/gear</li>
            <li>Accept offer & meet at campus library to swap</li>
          </ol>
        </div>
      </div>

      {/* Active Proposals Section */}
      {activeExchanges.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-navy-900 flex items-center">
            <ArrowRightLeft className="w-4 h-4 mr-2 text-brand-blue" />
            Active Exchange Proposals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeExchanges.map((ex) => (
              <div key={ex.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">
                    Proposed by <strong>{ex.requesterName}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Status: {ex.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-1">Offered Item:</span>
                    <p className="font-bold text-navy-900 line-clamp-2">{ex.offeredProduct.title}</p>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-brand-blue block mb-1">Requested Item:</span>
                    <p className="font-bold text-navy-900 line-clamp-2">{ex.targetProduct.title}</p>
                  </div>
                </div>

                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg text-[11px] italic">
                  "{ex.notes}"
                </p>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => alert('Exchange proposal accepted! Arranging campus meeting point.')}
                    className="px-3.5 py-1.5 bg-brand-green text-white font-bold rounded-lg hover:bg-emerald-600 transition"
                  >
                    Accept Exchange
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Products for Exchange */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-navy-900">
              Items Open for Swap ({exchangeableProducts.length})
            </h2>
            <p className="text-xs text-slate-500">
              These sellers are willing to accept textbook or gear swaps instead of cash.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search exchangeable items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchangeableProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img src={p.images[0]} alt={p.title} className="w-full aspect-[4/3] object-cover" />
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Open for Exchange
                  </span>
                  <h3 className="font-bold text-navy-900 text-sm line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {p.sellerName} • {p.institutionName}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedTargetProduct(p)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-brand-blue hover:text-white text-navy-900 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Propose Swap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Propose Swap Modal */}
      {selectedTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-navy-900 text-base mb-1">
              Propose Educational Item Swap
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Swap with <strong>{selectedTargetProduct.sellerName}</strong> for "{selectedTargetProduct.title}".
            </p>

            {isSuccess ? (
              <div className="p-6 text-center text-xs space-y-2">
                <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto" />
                <p className="font-bold text-navy-900 text-sm">Swap Proposal Sent!</p>
                <p className="text-slate-500">The seller has been notified to review your offer.</p>
              </div>
            ) : (
              <form onSubmit={handleProposeSwap} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    What item are you offering in exchange?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering Mathematics by H.K. Dass or Drafter"
                    value={myOfferedProductTitle}
                    onChange={(e) => setMyOfferedProductTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Exchange Notes / Handover Preference
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. In good condition, can meet tomorrow at Central Library..."
                    value={exchangeNote}
                    onChange={(e) => setExchangeNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTargetProduct(null)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-green text-white font-bold rounded-xl hover:bg-emerald-600 transition"
                  >
                    Send Swap Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
