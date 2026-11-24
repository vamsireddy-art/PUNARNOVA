'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Phone,
  Building,
  User as UserIcon,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { PaymentMethod, FulfillmentType, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currentUser, createOrder } = useAppStore();

  const [addressData, setAddressData] = useState({
    fullName: currentUser?.fullName || '',
    phoneNumber: currentUser?.mobileNumber || '',
    hostelOrBuilding: '',
    roomOrFlat: '',
    campusLandmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [saveAddress, setSaveAddress] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('campus_handover');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Load user's saved address if available
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      try {
        const saved = localStorage.getItem(`punarnova_saved_address_${currentUser.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setAddressData((prev) => ({
            ...prev,
            ...parsed,
            fullName: currentUser.fullName || parsed.fullName || '',
            phoneNumber: currentUser.mobileNumber || parsed.phoneNumber || '',
          }));
        } else {
          setAddressData((prev) => ({
            ...prev,
            fullName: currentUser.fullName || '',
            phoneNumber: currentUser.mobileNumber || '',
          }));
        }
      } catch (e) {
        // ignore parsing errors
      }
    }
  }, [currentUser]);

  if (!currentUser && !confirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Sign In Required to Checkout</h2>
        <p className="text-xs text-slate-500 mb-6">Please sign in with your campus student account to complete this order.</p>
        <Link href="/auth/signin" className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black inline-block transition shadow-emerald">
          Sign In Now
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );
  const platformFee = 20;
  const deliveryFee = 0;
  const studentDiscount = 0;
  const totalAmount = subtotal + platformFee + deliveryFee - studentDiscount;

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-6">Select educational products before checkout.</p>
        <Link href="/buy" className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black inline-block transition shadow-emerald">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate that the user provided their complete address
    if (!addressData.hostelOrBuilding.trim()) {
      setErrorMessage('Please enter your Hostel Name, Hall of Residence, or Department Building.');
      return;
    }
    if (!addressData.roomOrFlat.trim()) {
      setErrorMessage('Please enter your Room Number, Floor, or Flat details.');
      return;
    }
    if (!addressData.city.trim()) {
      setErrorMessage('Please enter your Campus City / Location.');
      return;
    }
    if (!addressData.phoneNumber.trim()) {
      setErrorMessage('Please enter a valid phone number for handover coordination.');
      return;
    }

    setIsProcessing(true);

    // Save address if user opted in
    if (saveAddress && typeof window !== 'undefined' && currentUser) {
      localStorage.setItem(`punarnova_saved_address_${currentUser.id}`, JSON.stringify(addressData));
    }

    const fullAddress = [
      addressData.hostelOrBuilding.trim(),
      addressData.roomOrFlat.trim(),
      addressData.campusLandmark.trim(),
      addressData.city.trim(),
      addressData.state.trim(),
      addressData.pincode.trim(),
    ].filter(Boolean).join(', ');

    setTimeout(() => {
      // Place order in 'created' status so Admin can confirm, mark ready for handover, and complete
      const order = createOrder({
        buyerId: currentUser?.id || 'guest',
        buyerName: currentUser?.fullName || addressData.fullName,
        sellerId: cart[0]?.product.sellerId || 'seller-1',
        sellerName: cart[0]?.product.sellerName || 'Verified Peer',
        items: cart.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          unitPrice: i.product.sellingPrice,
        })),
        subtotal,
        platformFee,
        deliveryFee,
        studentDiscount,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
        fulfillmentType,
        orderStatus: 'created',
        deliveryAddress: `${fullAddress} (Contact: ${addressData.phoneNumber})`,
      });

      setIsProcessing(false);
      setConfirmedOrder(order);
    }, 1200);
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
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold mb-2">
              Order Placed Successfully ✓
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900">
              Campus Handover Initiated!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Order ID: <span className="font-mono font-bold text-slate-800">{confirmedOrder.orderNumber}</span>
            </p>
          </div>

          {/* Handover Code Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Security Handover OTP</span>
              <span className="font-mono text-base font-bold text-brand-blue">
                #{confirmedOrder.pickupCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Present this verification code to the seller when receiving your item on campus.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Delivery / Handover Spot: </span>
              <span>{confirmedOrder.deliveryAddress}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Link
              href="/orders"
              className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-black rounded-xl text-xs transition shadow-emerald text-center"
            >
              Track in My Orders
            </Link>
            <Link
              href="/"
              className="py-3 px-5 bg-white hover:bg-[#ECFDF5] text-[#0B1F33] border-2 border-[#0B1F33] hover:border-[#10B981] font-bold rounded-xl text-xs transition text-center"
            >
              Home
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
              Add your campus address and select your payment method to complete the order.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

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
                        ? 'border-[#10B981] bg-[#ECFDF5] text-[#065F46] font-bold ring-2 ring-[#10B981]/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="font-bold text-[#0B1F33]">Campus Peer Handover</p>
                    <p className="text-[11px] text-[#64748B] font-normal mt-0.5">
                      Meet at library, cafeteria, or department (Free)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('hostel_delivery')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      fulfillmentType === 'hostel_delivery'
                        ? 'border-[#10B981] bg-[#ECFDF5] text-[#065F46] font-bold ring-2 ring-[#10B981]/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="font-bold text-[#0B1F33]">Hostel Room Drop</p>
                    <p className="text-[11px] text-[#64748B] font-normal mt-0.5">
                      Direct handover to your hostel wing or room
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 2: User's Own Campus Address & Contact */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-navy-900 text-sm flex items-center">
                    <Building className="w-4 h-4 mr-2 text-brand-blue" />
                    2. Your Campus Delivery / Handover Address
                  </h2>
                  <span className="text-[11px] text-slate-400">Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karri Mohan Vamsi Reddy"
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Contact for Handover <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={addressData.phoneNumber}
                      onChange={(e) => setAddressData({ ...addressData, phoneNumber: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Hostel / Hall / Department Building <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Block C, Aryabhatta Hostel / CSE Dept"
                      value={addressData.hostelOrBuilding}
                      onChange={(e) => setAddressData({ ...addressData, hostelOrBuilding: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Room No. / Floor / Wing <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Room 304, 3rd Floor"
                      value={addressData.roomOrFlat}
                      onChange={(e) => setAddressData({ ...addressData, roomOrFlat: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Campus Landmark / Handover Spot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Central Library entrance, Canteen staircase, Gate 2"
                      value={addressData.campusLandmark}
                      onChange={(e) => setAddressData({ ...addressData, campusLandmark: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      City / Campus Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surampalem / Kakinada"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="e.g. Andhra Pradesh"
                        value={addressData.state}
                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="e.g. 533437"
                        value={addressData.pincode}
                        onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-center space-x-2 pt-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>Save this address as my default campus delivery location</span>
                </label>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-navy-900 text-sm flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-brand-blue" />
                    3. Payment Method
                  </h2>
                  <span className="text-[10px] text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded font-bold border border-[#A7F3D0]">
                    ₹20 Flat Platform Fee
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
                    <span className="text-emerald-600 font-semibold text-[11px]">Popular</span>
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
                        <p className="font-bold text-navy-900">Cash / UPI on Physical Handover</p>
                        <p className="text-[11px] text-slate-500">Inspect the book or calculator before paying</p>
                      </div>
                    </div>
                    <span className="text-[#10B981] font-bold text-[11px]">Direct Handover</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Order Summary & Place Order */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-navy-900 text-sm">Order Summary</h3>

                {/* Items in cart */}
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5 truncate max-w-[170px]">
                        <img
                          src={item.product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-navy-900 truncate">{item.product.title}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-navy-900">
                        ₹{(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campus Handover Delivery</span>
                    <span className="text-emerald-600 font-semibold">FREE (Direct)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="text-slate-900 font-semibold">₹{platformFee}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-[#0B1F33]">
                    <span>Total Amount</span>
                    <span className="text-[#10B981]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-[#0B1F33] hover:text-white font-black rounded-xl text-xs sm:text-sm transition shadow-emerald flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Place Order & Get Handover Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Security & DPDP Safeguard Badge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-[11px] space-y-2">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <span>Campus Escrow & Safety Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Funds or payment are verified only when you input the 4-digit handover OTP upon inspecting the physical item.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
