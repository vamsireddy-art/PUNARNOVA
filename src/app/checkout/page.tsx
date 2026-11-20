'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Phone,
  Building,
  User as UserIcon,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { PaymentMethod, FulfillmentType, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currentUser, createOrder } = useAppStore();

  const [addressData, setAddressData] = useState({
    fullName: currentUser.fullName,
    phoneNumber: currentUser.mobileNumber,
    hostelOrBuilding: 'Hostel 12, Wing B',
    roomOrFlat: 'Room 304',
    campusLandmark: 'Near Central Library & Gymkhana Grounds',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
  });

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('campus_handover');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );
  const deliveryFee = 0;
  const studentDiscount = 0;
  const totalAmount = subtotal + deliveryFee - studentDiscount;

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-6">Select educational products before checkout.</p>
        <Link href="/buy" className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Razorpay / Gateway authorization test mode
    setTimeout(() => {
      const order = createOrder({
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        sellerId: cart[0]?.product.sellerId || 'seller-1',
        sellerName: cart[0]?.product.sellerName || 'Verified Peer',
        items: cart.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          unitPrice: i.product.sellingPrice,
        })),
        subtotal,
        deliveryFee,
        studentDiscount,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
        fulfillmentType,
        orderStatus: 'confirmed',
        deliveryAddress: `${addressData.hostelOrBuilding}, ${addressData.roomOrFlat}, ${addressData.campusLandmark}, ${addressData.city}`,
      });

      setIsProcessing(false);
      setConfirmedOrder(order);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {confirmedOrder ? (
        // ORDER CONFIRMATION MODAL / SCREEN
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-elevated text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-green mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold mb-2">
              Order Confirmed ✓
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900">
              Handover Code: #{confirmedOrder.pickupCode}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Order Number: <strong className="text-navy-900">{confirmedOrder.orderNumber}</strong>
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid (Razorpay Test Mode):</span>
              <span className="font-bold text-navy-900">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Handover Location:</span>
              <span className="font-medium text-slate-800 truncate max-w-[200px]">
                {confirmedOrder.deliveryAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Seller:</span>
              <span className="font-medium text-slate-800">{confirmedOrder.sellerName}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 text-left flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Show code <strong>#{confirmedOrder.pickupCode}</strong> to the seller when picking up your items. Payment is safely held in escrow until condition inspection.
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Link
              href="/orders"
              className="flex-1 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition"
            >
              Track in My Orders
            </Link>
            <Link
              href="/"
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      ) : (
        // CHECKOUT FORM
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          <div>
            <Link href="/cart" className="inline-flex items-center text-xs text-slate-500 hover:text-brand-blue mb-2">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Cart</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Checkout & Campus Handover
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Confirm your campus handover location and secure payment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Handover Address & Payment Gateway */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Handover Type */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-bold text-navy-900 text-sm flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-brand-blue" />
                  1. Fulfillment Option
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('campus_handover')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      fulfillmentType === 'campus_handover'
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold ring-2 ring-blue-100'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">Campus Peer Handover</p>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Meet at library, hostel gate, or department (Free)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('hostel_delivery')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      fulfillmentType === 'hostel_delivery'
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold ring-2 ring-blue-100'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">Hostel Room Drop</p>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Direct delivery to your hostel room desk
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 2: Campus Address & Contact */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <h2 className="font-bold text-navy-900 text-sm flex items-center">
                  <Building className="w-4 h-4 mr-2 text-brand-blue" />
                  2. Campus Location Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hostel / Department Building</label>
                    <input
                      type="text"
                      required
                      value={addressData.hostelOrBuilding}
                      onChange={(e) => setAddressData({ ...addressData, hostelOrBuilding: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Room No. / Floor</label>
                    <input
                      type="text"
                      required
                      value={addressData.roomOrFlat}
                      onChange={(e) => setAddressData({ ...addressData, roomOrFlat: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Campus Landmark / Handover Spot</label>
                    <input
                      type="text"
                      value={addressData.campusLandmark}
                      onChange={(e) => setAddressData({ ...addressData, campusLandmark: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Contact for Handover</label>
                    <input
                      type="tel"
                      required
                      value={addressData.phoneNumber}
                      onChange={(e) => setAddressData({ ...addressData, phoneNumber: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-navy-900 text-sm flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-brand-blue" />
                    3. Payment Gateway
                  </h2>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                    Razorpay Test Mode Active
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="text-brand-blue focus:ring-brand-blue"
                      />
                      <div>
                        <p className="font-bold text-navy-900">Razorpay (Cards / NetBanking / Wallets)</p>
                        <p className="text-[11px] text-slate-500">Escrow-backed student buyer protection</p>
                      </div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">Instant</span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-brand-blue focus:ring-brand-blue"
                      />
                      <div>
                        <p className="font-bold text-navy-900">Instant UPI (GPay / PhonePe / Paytm)</p>
                        <p className="text-[11px] text-slate-500">Scan QR or enter UPI VPA</p>
                      </div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">UPI 2.0</span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cash_on_pickup'}
                        onChange={() => setPaymentMethod('cash_on_pickup')}
                        className="text-brand-blue focus:ring-brand-blue"
                      />
                      <div>
                        <p className="font-bold text-navy-900">Cash on Physical Handover</p>
                        <p className="text-[11px] text-slate-500">Inspect textbook/gear before paying seller</p>
                      </div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">Cash</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24 text-xs">
              <h2 className="font-bold text-navy-900 text-sm pb-3 border-b border-slate-100">
                Order Review
              </h2>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="truncate max-w-[170px]">
                      <p className="font-semibold text-navy-900 truncate">{item.product.title}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-navy-900">
                      ₹{(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campus Handover:</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between font-extrabold text-navy-900 text-sm pt-2 border-t border-slate-100">
                  <span>Final Amount:</span>
                  <span className="text-brand-blue text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition shadow-soft flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Order & Payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Confirm Order (₹{totalAmount})</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-slate-400 text-center leading-tight">
                🔒 256-bit encrypted student transaction. Instant cancellation available prior to physical handover.
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
