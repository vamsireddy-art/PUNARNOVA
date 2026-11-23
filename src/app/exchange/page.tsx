'use client';

import React, { useState, useMemo } from 'react';
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
  Search,
  Zap,
  Building,
  Check,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ProductExchange, Product } from '@/types';

export default function ExchangeMarketplacePage() {
  const { products, currentUser, exchanges, proposeExchange, updateExchangeStatus, allInstitutions, selectedCampus } = useAppStore();
  const exchangeableProducts = products.filter((p) => p.isExchangeAvailable && p.status === 'available');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetProduct, setSelectedTargetProduct] = useState<Product | null>(null);
  const [myOfferedProductTitle, setMyOfferedProductTitle] = useState('');
  const [exchangeNote, setExchangeNote] = useState('');
  const [handoverSpot, setHandoverSpot] = useState('Central Library Foyer');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter exchanges relevant to logged in user or general demo
  const userExchanges = currentUser
    ? exchanges.filter((e) => e.requesterId === currentUser.id || e.ownerId === currentUser.id)
    : exchanges;

  // Filter products matching search
  const filteredProducts = useMemo(() => {
    return exchangeableProducts.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.exchangeWantedNotes && p.exchangeWantedNotes.toLowerCase().includes(q))
      );
    });
  }, [exchangeableProducts, searchQuery]);

  // AI Smart Swap Matches: Finds high-probability mutual exchange pairings
  const smartMatches = useMemo(() => {
    const pairs: { itemA: Product; itemB: Product; matchScore: number; reason: string }[] = [];
    for (let i = 0; i < exchangeableProducts.length; i++) {
      for (let j = i + 1; j < exchangeableProducts.length; j++) {
        const a = exchangeableProducts[i];
        const b = exchangeableProducts[j];
        if (a.sellerId !== b.sellerId) {
          // Check if Wanted notes align with title or subject
          const aWantsB = a.exchangeWantedNotes && (
            b.title.toLowerCase().includes(a.exchangeWantedNotes.toLowerCase().slice(0, 8)) ||
            (b.subject && a.exchangeWantedNotes.toLowerCase().includes(b.subject.toLowerCase()))
          );
          const bWantsA = b.exchangeWantedNotes && (
            a.title.toLowerCase().includes(b.exchangeWantedNotes.toLowerCase().slice(0, 8)) ||
            (a.subject && b.exchangeWantedNotes.toLowerCase().includes(a.subject.toLowerCase()))
          );

          if (aWantsB || bWantsA || a.institutionId === b.institutionId) {
            pairs.push({
              itemA: a,
              itemB: b,
              matchScore: (aWantsB && bWantsA) ? 98 : (aWantsB || bWantsA) ? 88 : 78,
              reason: (aWantsB && bWantsA)
                ? 'Mutual wishlist match: Both students want what the other has listed!'
                : `Same campus (${a.institutionName.split(' ')[0]}) complementary coursework exchange.`,
            });
          }
        }
      }
    }
    return pairs.slice(0, 2);
  }, [exchangeableProducts]);

  const handleProposeSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetProduct || !myOfferedProductTitle.trim()) return;

    proposeExchange({
      requesterId: currentUser?.id || 'guest',
      requesterName: currentUser?.fullName || 'Student',
      requesterCampus: currentUser?.institutionName || selectedCampus?.name || 'Campus Partner',
      offeredProduct: {
        id: `offered-${Date.now()}`,
        sellerId: currentUser?.id || 'guest',
        sellerName: currentUser?.fullName || 'Student',
        sellerVerificationStatus: currentUser?.verificationStatus || 'not_verified',
        institutionId: currentUser?.institutionId || 'inst-aditya',
        institutionName: currentUser?.institutionName || 'Aditya University',
        categoryId: 'cat-exchange',
        categoryName: 'Books & Coursework',
        title: myOfferedProductTitle.trim(),
        description: exchangeNote,
        brand: 'Academic',
        condition: 'Good',
        originalPrice: 600,
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
      ownerCampus: selectedTargetProduct.institutionName,
      notes: exchangeNote || 'Direct book exchange proposed',
      handoverSpot,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedTargetProduct(null);
      setMyOfferedProductTitle('');
      setExchangeNote('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-xl relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-bold border border-brand-green/30">
            <Repeat className="w-3.5 h-3.5" />
            <span>Campus Barter & Swaps</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Smart Educational Barter & Book Swaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a course reference for next semester? Swap with peers on your campus for <strong>₹0 cash exchange</strong>. Save money and keep educational materials circulating freely.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-xs space-y-2.5 shrink-0 max-w-xs relative z-10">
          <p className="font-bold text-white flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-brand-green" />
            Zero-Cash Student Barter Rules:
          </p>
          <ul className="space-y-1 text-slate-200 text-[11px] list-disc pl-4">
            <li>Find an item marked "Open for Swap"</li>
            <li>Offer your previous semester textbook</li>
            <li>Meet at official Campus Safe Handover spots</li>
            <li>Both students earn Green Impact badges</li>
          </ul>
        </div>
      </div>

      {/* AI Smart Swap Recommendations */}
      {smartMatches.length > 0 && (
        <section className="p-6 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 border border-indigo-200/80 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-950 font-extrabold text-base">
            <Zap className="w-5 h-5 text-indigo-600 fill-current" />
            <h2>AI Smart Swap Matchmaker (Complementary Student Pairings)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smartMatches.map((pair, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-bold text-indigo-900">{pair.reason}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                    {pair.matchScore}% Match
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1 p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">{pair.itemA.sellerName} has:</span>
                    <p className="font-bold text-navy-900 line-clamp-1">{pair.itemA.title}</p>
                    <span className="text-[10px] text-brand-blue">{pair.itemA.institutionName.split(' ')[0]}</span>
                  </div>

                  <ArrowRightLeft className="w-5 h-5 text-indigo-500 shrink-0" />

                  <div className="flex-1 p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                    <span className="text-[10px] text-indigo-500 block font-semibold">{pair.itemB.sellerName} has:</span>
                    <p className="font-bold text-navy-900 line-clamp-1">{pair.itemB.title}</p>
                    <span className="text-[10px] text-brand-blue">{pair.itemB.institutionName.split(' ')[0]}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTargetProduct(pair.itemB)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <span>Initiate This Barter Offer</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Proposals Section */}
      {userExchanges.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-navy-900 flex items-center">
            <ArrowRightLeft className="w-4 h-4 mr-2 text-brand-blue" />
            Your Exchange Proposals & Agreements ({userExchanges.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userExchanges.map((ex) => (
              <div key={ex.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-navy-900">{ex.requesterName}</span>
                    <span className="text-slate-400"> ➔ </span>
                    <span className="font-bold text-navy-900">{ex.ownerName}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ex.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ex.status === 'accepted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ex.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-1">Offered Item:</span>
                    <p className="font-bold text-navy-900 line-clamp-2">{ex.offeredProduct.title}</p>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
                    <span className="text-[10px] text-brand-blue block font-semibold mb-1">Requested Item:</span>
                    <p className="font-bold text-navy-900 line-clamp-2">{ex.targetProduct.title}</p>
                  </div>
                </div>

                {ex.handoverSpot && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-brand-green shrink-0" />
                    <span>Safe Campus Handover: <strong>{ex.handoverSpot}</strong></span>
                  </p>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2">
                  {ex.status === 'proposed' && (
                    <button
                      onClick={() => updateExchangeStatus(ex.id, 'accepted')}
                      className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition"
                    >
                      Accept Barter
                    </button>
                  )}
                  {ex.status === 'accepted' && (
                    <button
                      onClick={() => updateExchangeStatus(ex.id, 'completed')}
                      className="px-4 py-2 bg-brand-green hover:bg-emerald-600 text-white font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Completed Handover</span>
                    </button>
                  )}
                  {ex.status === 'completed' && (
                    <span className="text-emerald-700 font-bold text-xs flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-brand-green" />
                      Completed & Recorded in Environmental Ledger
                    </span>
                  )}
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
              Campus Items Open for Barter ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500">
              Sellers who are ready to accept peer textbook swaps instead of cash.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by book title, author, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-elevated transition">
              <div>
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-indigo-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
                    <Repeat className="w-3 h-3 text-indigo-300" />
                    <span>Open for Swap</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-brand-blue">{p.categoryName}</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5" />
                      {p.institutionName.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-sm line-clamp-2 leading-snug">{p.title}</h3>

                  {p.exchangeWantedNotes && (
                    <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900">
                      <span className="font-bold block">Wants in exchange:</span>
                      <p className="line-clamp-2 mt-0.5">{p.exchangeWantedNotes}</p>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 flex items-center pt-1">
                    <span>Seller: <strong>{p.sellerName}</strong></span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedTargetProduct(p)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-soft"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Propose Exchange Offer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Propose Swap Modal */}
      {selectedTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-navy-900 text-base">
                Propose Educational Item Swap
              </h3>
              <button onClick={() => setSelectedTargetProduct(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Swap with <strong>{selectedTargetProduct.sellerName}</strong> ({selectedTargetProduct.institutionName}) for "{selectedTargetProduct.title}".
            </p>

            {isSuccess ? (
              <div className="p-6 text-center text-xs space-y-2">
                <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto" />
                <p className="font-bold text-navy-900 text-sm">Swap Proposal Sent!</p>
                <p className="text-slate-500">The peer seller has been notified to review your barter terms.</p>
              </div>
            ) : (
              <form onSubmit={handleProposeSwap} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    What textbook / gear are you offering?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Higher Engineering Mathematics or Lab Kit"
                    value={myOfferedProductTitle}
                    onChange={(e) => setMyOfferedProductTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preferred Official Campus Handover Zone
                  </label>
                  <select
                    value={handoverSpot}
                    onChange={(e) => setHandoverSpot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Central Library Foyer">Central Library Foyer (Reading Hall entrance)</option>
                    <option value="Student Activity Center (SAC)">Student Activity Center (SAC)</option>
                    <option value="Main Campus Security Gate Desk">Main Campus Security Gate Desk</option>
                    <option value="Department Foyer">Department Foyer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Message to Peer
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Book is in excellent shape, clean pages. Can meet tomorrow afternoon..."
                    value={exchangeNote}
                    onChange={(e) => setExchangeNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTargetProduct(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-green hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-soft"
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
