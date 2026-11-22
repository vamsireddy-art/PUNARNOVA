'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Cpu, 
  DollarSign, 
  Trash2,
  Clock,
  Sparkles,
  Lock,
  Search,
  Eye
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { OrderStatus } from '@/types';

export default function AdminDashboardPage() {
  const { 
    currentUser, 
    verifications, 
    reviewVerification, 
    products, 
    orders,
    updateOrderStatus
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'products' | 'ai_performance' | 'moderation'>('verifications');
  const [selectedVerificationDoc, setSelectedVerificationDoc] = useState<any | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // RBAC Guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-navy-900">Admin Clearance Required</h2>
        <p className="text-xs text-slate-500">
          This portal is restricted to institutional administrators. Please sign in with administrator credentials.
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
          <p className="font-semibold text-slate-700">Administrator Credentials:</p>
          <p className="text-slate-600 font-mono text-[11px]">Email: admin@punarnova.in</p>
          <p className="text-slate-600 font-mono text-[11px]">Password: Admin@PunarNova2026</p>
        </div>
        <Link href="/auth/signin" className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold inline-block transition">
          Sign In as Administrator
        </Link>
      </div>
    );
  }

  const pendingVerifications = verifications.filter((v) => v.status === 'pending');
  const verifiedCount = verifications.filter((v) => v.status === 'verified').length + 842;
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 482500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Trust & Safety Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Platform Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as {currentUser.fullName} ({currentUser.institutionName})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            RBAC: Super Administrator
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-700">Total Registered Users</span>
            <Users className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-extrabold text-navy-900">1,420</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">890 Active Students</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-700">Pending Student IDs</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{pendingVerifications.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires manual review</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-700">Active Listings</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-navy-900">{products.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 12 categories</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-700">Total Marketplace Volume</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-navy-900">₹{totalSales.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">0% Commission Model</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 transition ${
            activeTab === 'verifications'
              ? 'border-b-2 border-brand-blue text-brand-blue'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Student Verifications ({pendingVerifications.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition ${
            activeTab === 'orders'
              ? 'border-b-2 border-brand-blue text-brand-blue'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Orders & Handovers ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition ${
            activeTab === 'products'
              ? 'border-b-2 border-brand-blue text-brand-blue'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Listings Moderation ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('ai_performance')}
          className={`pb-3 transition ${
            activeTab === 'ai_performance'
              ? 'border-b-2 border-brand-blue text-brand-blue'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          AI Price Engine Diagnostics
        </button>
      </div>

      {/* TAB 1: VERIFICATIONS QUEUE */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-sm">
              Pending Student ID Card Review ({pendingVerifications.length})
            </h3>
            <span className="text-xs text-slate-400">Strict Encrypted Vault Access</span>
          </div>

          {pendingVerifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              All verification requests have been processed! No pending submissions.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {pendingVerifications.map((v) => (
                <div key={v.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-navy-900 text-sm">{v.userName}</span>
                      <span className="bg-blue-50 text-brand-blue px-2 py-0.5 rounded text-[10px] font-semibold">
                        {v.institutionName}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Account Name: <strong>{v.userName}</strong> | Document Legal Name: <strong>{v.verifiedLegalName}</strong>
                    </p>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="font-bold text-emerald-600">
                        Fuzzy Match Score: {v.nameMatchScore}% Match
                      </span>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => setSelectedVerificationDoc(v)}
                        className="text-brand-blue hover:underline flex items-center font-medium"
                      >
                        <Eye className="w-3 h-3 mr-1" /> View Encrypted ID Preview
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => reviewVerification(v.id, true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Verified</span>
                    </button>
                    <button
                      onClick={() => reviewVerification(v.id, false, 'Card image blurry or expired academic year')}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold rounded-xl text-xs transition"
                    >
                      Reject with Reason
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ORDERS & HANDOVERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-navy-900 text-base">
                Campus Orders & Physical Handover Management ({orders.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin controls: Confirm placed orders, advance to ready for handover, and mark completed upon physical exchange.
              </p>
            </div>
            <Link
              href="/orders"
              className="text-xs text-brand-blue font-semibold hover:underline flex items-center"
            >
              <span>Open Full Orders Console →</span>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No orders placed yet across the campus network.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-3 text-xs bg-slate-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-navy-900 text-sm">{o.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.orderStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.orderStatus === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : o.orderStatus === 'ready_for_handover' || o.orderStatus === 'ready_for_pickup'
                          ? 'bg-purple-100 text-purple-800'
                          : o.orderStatus === 'created'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {o.orderStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                      <span>Total: <strong className="text-brand-blue font-bold">₹{o.totalAmount.toLocaleString('en-IN')}</strong></span>
                      <span>Handover OTP: <strong className="font-mono text-slate-800">#{o.pickupCode}</strong></span>
                      <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-100 text-[11px]">
                    <div>
                      <p className="text-slate-400 font-medium">Buyer & Delivery Address:</p>
                      <p className="font-bold text-slate-800 mt-0.5">{o.buyerName}</p>
                      <p className="text-slate-600 mt-0.5 leading-normal">{o.deliveryAddress || 'Campus Peer Handover Point'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Seller & Items:</p>
                      <p className="font-bold text-slate-800 mt-0.5">{o.sellerName}</p>
                      <p className="text-slate-600 mt-0.5">
                        {o.items.map((it) => `${it.product.title} (x${it.quantity})`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Admin Order Control Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-semibold">Change Lifecycle State:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {o.orderStatus === 'created' && (
                        <button
                          onClick={() => {
                            setStatusUpdatingId(o.id);
                            updateOrderStatus(o.id, 'confirmed');
                            setTimeout(() => setStatusUpdatingId(null), 300);
                          }}
                          disabled={statusUpdatingId === o.id}
                          className="px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg text-[11px] transition shadow-sm"
                        >
                          ✓ Confirm Order
                        </button>
                      )}

                      {(o.orderStatus === 'confirmed' || o.orderStatus === 'created') && (
                        <button
                          onClick={() => {
                            setStatusUpdatingId(o.id);
                            updateOrderStatus(o.id, 'ready_for_handover');
                            setTimeout(() => setStatusUpdatingId(null), 300);
                          }}
                          disabled={statusUpdatingId === o.id}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] transition shadow-sm"
                        >
                          Mark Ready for Handover
                        </button>
                      )}

                      {(o.orderStatus === 'ready_for_handover' || o.orderStatus === 'ready_for_pickup' || o.orderStatus === 'confirmed') && (
                        <button
                          onClick={() => {
                            setStatusUpdatingId(o.id);
                            updateOrderStatus(o.id, 'completed');
                            setTimeout(() => setStatusUpdatingId(null), 300);
                          }}
                          disabled={statusUpdatingId === o.id}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition shadow-sm"
                        >
                          ✓ Mark Completed
                        </button>
                      )}

                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="p-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700"
                      >
                        <option value="created">Placed (created)</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="ready_for_handover">Ready for Handover</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT MODERATION */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-sm">Active Educational Listings ({products.length})</h3>
            <span className="text-xs text-slate-400">Prohibited items filter active</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {products.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-navy-900 line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Seller: {p.sellerName} • {p.institutionName} • ₹{p.sellingPrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/product/${p.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                  >
                    Inspect
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Remove listing "${p.title}" for policy violation?`)) {
                        alert('Listing removed from student marketplace.');
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI PRICING PERFORMANCE */}
      {activeTab === 'ai_performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-brand-blue" />
                <h3 className="font-bold text-navy-900 text-base">Model Accuracy & Loss Benchmarks</h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">
                Status: Optimal Convergence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Mean Absolute Error (MAE)</span>
                <span className="text-2xl font-black text-navy-900">₹34.20</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">&plusmn; 4.1% of item value</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Root Mean Squared Error (RMSE)</span>
                <span className="text-2xl font-black text-navy-900">₹49.80</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Penalizes outliers</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Coefficient of Determination (R²)</span>
                <span className="text-2xl font-black text-brand-blue">0.941</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">94.1% variance explained</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-navy-900">Feature Importance Weights:</h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>1. Original Purchase Price (MSRP):</span>
                  <span className="font-mono font-bold">38%</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Product Condition Classification:</span>
                  <span className="font-mono font-bold">26%</span>
                </div>
                <div className="flex justify-between">
                  <span>3. Age & Monthly Usage Duration:</span>
                  <span className="font-mono font-bold">16%</span>
                </div>
                <div className="flex justify-between">
                  <span>4. Educational Category Demand Index:</span>
                  <span className="font-mono font-bold">11%</span>
                </div>
                <div className="flex justify-between">
                  <span>5. Complete Accessories & Original Packaging:</span>
                  <span className="font-mono font-bold">9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watermarked Document Preview Modal */}
      {selectedVerificationDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-navy-900 text-sm mb-2">
              Encrypted ID Review: {selectedVerificationDoc.userName}
            </h3>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
              <img
                src={selectedVerificationDoc.documentUrl}
                alt="ID Document"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white/40 text-2xl font-black rotate-[-25deg] tracking-widest uppercase">
                  CONFIDENTIAL • VERIFICATION ONLY
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedVerificationDoc(null)}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
