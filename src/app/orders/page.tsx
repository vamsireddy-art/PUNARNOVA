'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PackageCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  QrCode, 
  ArrowRight,
  ShoppingBag,
  Filter,
  Check,
  AlertTriangle,
  Building,
  User as UserIcon,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { OrderStatus, Order } from '@/types';

export default function MyOrdersPage() {
  const { orders, currentUser, updateOrderStatus } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'created' | 'confirmed' | 'ready' | 'completed'>('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#10B981] mx-auto flex items-center justify-center border border-[#A7F3D0]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy-900">Sign In to View Your Orders</h2>
        <p className="text-xs text-slate-500">
          Sign in to track your campus handovers, order statuses, and physical pickup codes.
        </p>
        <Link
          href="/auth/signin"
          className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black inline-block transition shadow-emerald"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  // Filter orders: Admin sees all; regular user sees their own purchases or sales
  const userRelevantOrders = isAdmin
    ? orders
    : orders.filter(
        (o) =>
          o.buyerId === currentUser.id ||
          o.sellerId === currentUser.id ||
          (currentUser.fullName && o.buyerName?.toLowerCase() === currentUser.fullName.toLowerCase())
      );

  const filteredOrders = userRelevantOrders.filter((order) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'created') return order.orderStatus === 'created';
    if (selectedFilter === 'confirmed') return order.orderStatus === 'confirmed';
    if (selectedFilter === 'ready') return order.orderStatus === 'ready_for_handover' || order.orderStatus === 'ready_for_pickup';
    if (selectedFilter === 'completed') return order.orderStatus === 'completed';
    return true;
  });

  const handleAdminStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setStatusUpdatingId(orderId);
    updateOrderStatus(orderId, newStatus);
    setTimeout(() => {
      setStatusUpdatingId(null);
    }, 400);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'created':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Placed — Awaiting Confirmation
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#10B981]" />
            Confirmed
          </span>
        );
      case 'ready_for_handover':
      case 'ready_for_pickup':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-purple-600 animate-pulse" />
            Ready for Handover
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Helper for progress stepper calculation
  const getStepState = (currentStatus: OrderStatus, step: 'created' | 'confirmed' | 'ready' | 'completed') => {
    const orderRanks: Record<string, number> = {
      created: 1,
      confirmed: 2,
      ready_for_handover: 3,
      ready_for_pickup: 3,
      completed: 4,
      cancelled: 0,
    };

    const targetRanks: Record<string, number> = {
      created: 1,
      confirmed: 2,
      ready: 3,
      completed: 4,
    };

    const currentRank = orderRanks[currentStatus] || 1;
    const targetRank = targetRanks[step];

    if (currentStatus === 'cancelled') return 'cancelled';
    if (currentRank > targetRank) return 'done';
    if (currentRank === targetRank) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {isAdmin ? (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin Order Lifecycle Console</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 text-xs text-brand-blue font-semibold uppercase tracking-wider mb-1">
              <PackageCheck className="w-4 h-4" />
              <span>Student Peer Network</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {isAdmin ? 'Platform Orders & Handover Management' : 'My Campus Orders & Handovers'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Review placed orders, confirm fulfillment, mark items ready for handover, and complete orders.'
              : 'Track real-time order confirmation, campus handover location, and security OTP codes.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'all'
                ? 'bg-navy-900 text-white shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({userRelevantOrders.length})
          </button>
          <button
            onClick={() => setSelectedFilter('created')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'created'
                ? 'bg-amber-600 text-white shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Placed ({userRelevantOrders.filter((o) => o.orderStatus === 'created').length})
          </button>
          <button
            onClick={() => setSelectedFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              selectedFilter === 'confirmed'
                ? 'bg-[#10B981] text-[#0B1F33] shadow-emerald'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Confirmed ({userRelevantOrders.filter((o) => o.orderStatus === 'confirmed').length})
          </button>
          <button
            onClick={() => setSelectedFilter('ready')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'ready'
                ? 'bg-purple-600 text-white shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Ready for Handover ({userRelevantOrders.filter((o) => o.orderStatus === 'ready_for_handover' || o.orderStatus === 'ready_for_pickup').length})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Completed ({userRelevantOrders.filter((o) => o.orderStatus === 'completed').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">
            {selectedFilter === 'all' ? 'No Orders Found' : `No ${selectedFilter.toUpperCase()} Orders`}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {isAdmin
              ? 'When students place orders on campus, they will appear here for admin confirmation.'
              : 'Browse pre-owned textbooks and scientific calculators listed by verified peers.'}
          </p>
          <Link
            href="/buy"
            className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black transition inline-flex items-center space-x-1.5 shadow-emerald"
          >
            <span>Browse Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-card"
            >
              {/* Top Order Information Bar */}
              <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Order Number</span>
                  <span className="font-bold text-navy-900 text-sm font-mono">{order.orderNumber}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Placed Date</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Total Amount</span>
                  <span className="font-extrabold text-brand-blue text-sm sm:text-base">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Payment</span>
                  <span className="font-medium text-slate-700 uppercase text-[11px]">
                    {order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Handover & Delivery Details Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#ECFDF5] to-emerald-50/40 border-b border-[#A7F3D0] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-[#0B1F33] text-[#10B981] rounded-2xl shadow-soft shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-[#0B1F33] text-sm">
                        Physical Handover OTP Code:
                      </p>
                      <span className="font-mono text-base font-black text-[#0B1F33] bg-white px-2 py-0.5 rounded-lg border border-[#A7F3D0]">
                        #{order.pickupCode || '4821'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Buyer presents this code upon inspecting item. Seller verifies before final handover.
                    </p>
                  </div>
                </div>

                {/* Campus Address Box */}
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-blue-200/60 text-left max-w-md">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                    <span>Campus Handover Location (Added by User):</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {order.deliveryAddress || 'Campus Peer Handover Point'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Buyer: <strong>{order.buyerName}</strong> • Seller: <strong>{order.sellerName}</strong>
                  </p>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-5 divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm line-clamp-1">
                          {item.product.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Category: {item.product.categoryName} • Condition: <span className="font-semibold text-slate-600">{item.product.condition}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-navy-900 text-sm">₹{item.unitPrice.toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Stepper Timeline */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100">
                <div className="grid grid-cols-4 gap-2 text-center max-w-2xl mx-auto text-[11px] font-semibold">
                  {/* Step 1: Placed */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      getStepState(order.orderStatus, 'created') === 'done' || getStepState(order.orderStatus, 'created') === 'active'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      1
                    </div>
                    <span className={getStepState(order.orderStatus, 'created') === 'active' ? 'text-navy-900 font-bold' : 'text-slate-500'}>
                      Order Placed
                    </span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      getStepState(order.orderStatus, 'confirmed') === 'done' || getStepState(order.orderStatus, 'confirmed') === 'active'
                        ? 'bg-[#10B981] text-[#0B1F33]'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      2
                    </div>
                    <span className={getStepState(order.orderStatus, 'confirmed') === 'active' ? 'text-[#10B981] font-bold' : 'text-slate-500'}>
                      Confirmed
                    </span>
                  </div>

                  {/* Step 3: Ready for Handover */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      getStepState(order.orderStatus, 'ready') === 'done' || getStepState(order.orderStatus, 'ready') === 'active'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      3
                    </div>
                    <span className={getStepState(order.orderStatus, 'ready') === 'active' ? 'text-purple-600 font-bold' : 'text-slate-500'}>
                      Ready for Handover
                    </span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      getStepState(order.orderStatus, 'completed') === 'done' || getStepState(order.orderStatus, 'completed') === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      4
                    </div>
                    <span className={getStepState(order.orderStatus, 'completed') === 'active' ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* ADMIN ACTION CONTROLS (Only visible to Admin) */}
              {isAdmin && (
                <div className="p-4 sm:p-5 bg-purple-50/70 border-t border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-purple-900">Admin Action Center:</span>
                    <span className="text-slate-600">Current Status: <strong className="uppercase">{order.orderStatus}</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Confirm Button */}
                    {order.orderStatus === 'created' && (
                      <button
                        onClick={() => handleAdminStatusChange(order.id, 'confirmed')}
                        disabled={statusUpdatingId === order.id}
                        className="px-3.5 py-2 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl transition shadow-emerald flex items-center space-x-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Order</span>
                      </button>
                    )}

                    {/* Ready for Handover Button */}
                    {(order.orderStatus === 'confirmed' || order.orderStatus === 'created') && (
                      <button
                        onClick={() => handleAdminStatusChange(order.id, 'ready_for_handover')}
                        disabled={statusUpdatingId === order.id}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-sm flex items-center space-x-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mark Ready for Handover</span>
                      </button>
                    )}

                    {/* Completed Button */}
                    {(order.orderStatus === 'ready_for_handover' || order.orderStatus === 'ready_for_pickup' || order.orderStatus === 'confirmed') && (
                      <button
                        onClick={() => handleAdminStatusChange(order.id, 'completed')}
                        disabled={statusUpdatingId === order.id}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Completed (Handover Done)</span>
                      </button>
                    )}

                    {/* Direct Override Dropdown */}
                    <div className="flex items-center space-x-1 pl-2 border-l border-purple-200">
                      <span className="text-[11px] text-purple-800">Set:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleAdminStatusChange(order.id, e.target.value as OrderStatus)}
                        className="p-1.5 rounded-lg border border-purple-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
