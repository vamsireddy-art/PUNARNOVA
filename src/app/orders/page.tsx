'use client';

import React from 'react';
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
  ShoppingBag
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function MyOrdersPage() {
  const { orders } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          My Campus Orders & Handovers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track active orders, peer meeting locations, and verify handover codes.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Find pre-owned textbooks and calculators listed by peers at your institution.
          </p>
          <Link
            href="/buy"
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition inline-flex items-center space-x-1.5"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Top Order Bar */}
              <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Order Number</span>
                  <span className="font-bold text-navy-900 text-sm font-mono">{order.orderNumber}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Placed On</span>
                  <span className="font-medium text-slate-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Total Paid</span>
                  <span className="font-extrabold text-brand-blue text-sm">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Handover Code Banner */}
              <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-blue text-white rounded-xl">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">
                      Physical Handover Code: <span className="font-mono text-base text-brand-blue">#{order.pickupCode || '4821'}</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Share this 4-digit code with seller ({order.sellerName}) upon physical item handover
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <span>Location: </span>
                  <strong className="text-slate-700">{order.deliveryAddress}</strong>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-5 divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-xs sm:text-sm line-clamp-1">
                          {item.product.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {item.product.categoryName} • Condition: {item.product.condition}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-navy-900">₹{item.unitPrice}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Tracking Timeline */}
              <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200">
                <div className="flex items-center justify-between max-w-xl mx-auto text-[11px] font-semibold text-slate-500">
                  <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Order Placed</span>
                  </div>
                  <div className="h-0.5 w-12 bg-emerald-500" />
                  <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmed</span>
                  </div>
                  <div className="h-0.5 w-12 bg-blue-500" />
                  <div className="flex items-center space-x-1.5 text-brand-blue font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Ready for Handover</span>
                  </div>
                  <div className="h-0.5 w-12 bg-slate-300" />
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
