'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  DollarSign, 
  Layers, 
  HelpCircle, 
  Eye, 
  X,
  FileCheck,
  TrendingUp,
  Cpu,
  Lock,
  Scan,
  Repeat,
  MapPin,
  Zap,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductCondition, AIPricePredictionResult, AIImageScanResult, Product } from '@/types';
import { requestPricePrediction, requestImageAnalysis } from '@/lib/ml-client';
import { VerificationModal } from '@/components/verification-modal';
import { BookScannerModal } from '@/components/book-scanner-modal';
import { calculateDealScore } from '@/lib/deal-score';

export default function SellWizardPage() {
  const router = useRouter();
  const { currentUser, selectedCampus, addProduct, allInstitutions, products } = useAppStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Step 1: Upload Images (1-5 real item images)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  ]);

  // Step 2: Questionnaire & Academic Details
  const [formData, setFormData] = useState({
    title: 'Introduction to Algorithms (CLRS)',
    category: 'Engineering Books',
    brand: 'MIT Press',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    edition: '4th Edition',
    isbn: '978-0262046305',
    subject: 'Computer Science / Algorithms',
    semester: 'Semester 3-4',
    modelNumber: '',
    originalPrice: 2499,
    purchaseDate: '2024-01',
    usageMonths: 10,
    condition: 'Excellent' as ProductCondition,
    hasDamages: false,
    damageNotes: 'Clean pages, no torn binding, minor pencil underline on chapter 2',
    hasAccessories: true,
    hasPackaging: false,
    pickupSpotId: selectedCampus?.safeHandoverSpots[0]?.id || '',
    pickupNotes: 'Central Library Foyer or Student Activity Center',
    deliveryAvailable: true,
    isExchangeAvailable: true,
    exchangeWantedNotes: 'Looking to swap for Operating Systems (Silberschatz) or GATE CS guide',
    description: 'Original CLRS 4th International edition. Essential for algorithm design, graph theories, dynamic programming and campus placements.',
  });

  // Step 3: AI Vision Scan Results
  const [isScanning, setIsScanning] = useState(false);
  const [visionScan, setVisionScan] = useState<AIImageScanResult | null>(null);

  // Step 4 & 5: ML Price Prediction
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<AIPricePredictionResult | null>(null);
  const [customPriceChosen, setCustomPriceChosen] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number>(1150);

  // Apply OCR / Book Scanner Data
  const handleApplyScannerData = (scanned: {
    title: string;
    author?: string;
    edition?: string;
    isbn?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      title: scanned.title || prev.title,
      author: scanned.author || prev.author,
      edition: scanned.edition || prev.edition,
      isbn: scanned.isbn || prev.isbn,
    }));
  };

  // Trigger Step 3: Run AI Computer Vision scan
  const handleProceedToScan = async () => {
    setCurrentStep(3);
    setIsScanning(true);
    const result = await requestImageAnalysis(images.length, formData.category, formData.condition);
    setVisionScan(result);
    setIsScanning(false);
  };

  // Trigger Step 4 & 5: Run ML Price Prediction
  const handleProceedToPrediction = async () => {
    setCurrentStep(4);
    setIsPredicting(true);
    const result = await requestPricePrediction({
      category: formData.category,
      originalPrice: Number(formData.originalPrice),
      ageMonths: Number(formData.usageMonths),
      condition: formData.condition,
      brand: formData.brand,
      hasAccessories: formData.hasAccessories,
      hasPackaging: formData.hasPackaging,
      damageScore: formData.hasDamages ? 0.25 : 0.05,
    });
    setPrediction(result);
    setFinalPrice(result.suggestedPrice);
    setIsPredicting(false);
    setCurrentStep(5);
  };

  // Deal score preview
  const previewDealScore = calculateDealScore(
    finalPrice,
    formData.originalPrice,
    formData.category,
    formData.condition,
    products
  );

  // Safe handover spots for current campus
  const currentInstitution = allInstitutions.find(
    (i) => i.id === currentUser?.institutionId || i.id === selectedCampus?.id
  ) || allInstitutions[0];

  // Step 6: Publish Listing
  const handlePublish = () => {
    if (!currentUser) {
      router.push('/auth/signin');
      return;
    }
    if (currentUser.verificationStatus !== 'verified') {
      setShowVerificationModal(true);
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.fullName,
      sellerAvatar: currentUser.avatarUrl,
      sellerVerificationStatus: currentUser.verificationStatus,
      institutionId: currentUser.institutionId || selectedCampus?.id || 'inst-aditya',
      institutionName: currentUser.institutionName || selectedCampus?.name || 'Aditya University (Surampalem)',
      categoryId: `cat-${Date.now()}`,
      categoryName: formData.category,
      title: formData.title,
      description: formData.description,
      brand: formData.brand,
      author: formData.author,
      edition: formData.edition,
      isbn: formData.isbn,
      subject: formData.subject,
      semester: formData.semester,
      modelNumber: formData.modelNumber,
      condition: formData.condition,
      originalPrice: Number(formData.originalPrice),
      sellingPrice: Number(finalPrice),
      aiEstimatedPrice: prediction?.suggestedPrice,
      suggestedMinPrice: prediction?.minPrice,
      suggestedMaxPrice: prediction?.maxPrice,
      aiConfidenceScore: prediction?.confidencePercentage,
      dealScore: previewDealScore,
      images,
      isNegotiable: true,
      isExchangeAvailable: formData.isExchangeAvailable,
      exchangeWantedNotes: formData.exchangeWantedNotes,
      pickupSpotId: formData.pickupSpotId || currentInstitution?.safeHandoverSpots[0]?.id,
      pickupLocationNotes: formData.pickupNotes,
      deliveryAvailable: formData.deliveryAvailable,
      status: 'available',
      viewCount: 1,
      wishlistCount: 0,
      createdAt: new Date().toISOString(),
      distanceKm: 0.5,
    };

    addProduct(newProduct);
    router.push(`/product/${newProduct.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Login / Verification Warning Banner */}
      {!currentUser ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-brand-blue shrink-0" />
            <div>
              <p className="font-bold">Sign In Required to Publish</p>
              <p className="text-blue-700">
                You must be signed in with your campus student account to publish listings on PunarNova.
              </p>
            </div>
          </div>
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl shrink-0 transition"
          >
            Sign In Now
          </Link>
        </div>
      ) : currentUser.verificationStatus !== 'verified' ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Student Verification Required to Publish</p>
              <p className="text-amber-700">
                You can calculate price valuations anytime, but publishing requires an approved student ID.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowVerificationModal(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shrink-0 transition"
          >
            Verify Student ID Now
          </button>
        </div>
      ) : null}

      {/* Wizard Header & Stepper */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <span>Campus Resale Valuation Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          List Educational Product & Estimate Value
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Marketplace algorithms assess wear diagnostics, syllabus edition, and historical peer transactions to benchmark fair pricing.
        </p>

        {/* 6 Step Progress Indicator */}
        <div className="pt-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-[11px] font-medium text-slate-400">
            {[
              { num: 1, label: 'Photos' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Scan' },
              { num: 4, label: 'Valuation' },
              { num: 5, label: 'Pricing' },
              { num: 6, label: 'Publish' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-1 transition-colors ${
                    currentStep === step.num
                      ? 'bg-slate-900 text-white ring-2 ring-slate-900/20'
                      : currentStep > step.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span className={currentStep === step.num ? 'text-slate-900 font-semibold' : ''}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD PRODUCT IMAGES */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 1: Upload Photographs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload 1 to 5 clear photographs (Front cover, barcode, spine, and visible wear).
              </p>
            </div>

            {/* Smart Book Scanner Launch Button */}
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-xs shrink-0"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Smart Book Scanner (OCR)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group bg-slate-50">
                <img src={img} alt={`Uploaded item photo ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full opacity-90 group-hover:opacity-100 transition shadow-xs"
                  title="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                  {idx === 0 ? 'Primary' : idx === 1 ? 'Barcode' : idx === 2 ? 'Pages' : `Photo ${idx + 1}`}
                </span>
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100/70 transition-colors p-4 text-center">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-700">Upload Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPEG / PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const files = Array.from(e.target.files);
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          if (uploadEvent.target?.result) {
                            setImages((prev) => {
                              if (prev.length >= 5) return prev;
                              return [...prev, uploadEvent.target!.result as string];
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      });
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {images.length === 0
                ? 'Please upload at least 1 photo to proceed.'
                : `${images.length} photo(s) selected.`}
            </span>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={images.length < 1}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <span>Next: Item Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRODUCT DETAILS & QUESTIONNAIRE */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 2: Educational Product Questionnaire</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter textbook or gear details. All fields can be manually corrected.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="px-3 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors flex items-center space-x-1 shrink-0"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Autofill with Scanner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">1. Product / Book Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">2. Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              >
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand / Publisher */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">3. Publisher / Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Author(s)</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Thomas H. Cormen"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Edition */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Edition / Revision</label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                placeholder="e.g. 4th Edition / 2024"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">ISBN Number</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="e.g. 978-0262046305"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Subject / Course */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject / Semester</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Data Structures / Sem 3"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Original Purchase Price */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">4. Original Purchase Price (₹ INR)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Usage Duration */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">5. Usage Duration (Months)</label>
              <input
                type="number"
                value={formData.usageMonths}
                onChange={(e) => setFormData({ ...formData, usageMonths: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Condition */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">6. Current Physical Condition</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Like New', 'Excellent', 'Good', 'Fair', 'Needs Repair'] as ProductCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      formData.condition === cond
                        ? 'border-brand-blue bg-blue-50 text-brand-blue font-bold ring-2 ring-blue-100'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Safe Handover Spot */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                7. Official Safe Campus Handover Location ({currentInstitution.name})
              </label>
              <select
                value={formData.pickupSpotId}
                onChange={(e) => setFormData({ ...formData, pickupSpotId: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                {currentInstitution.safeHandoverSpots.map((spot) => (
                  <option key={spot.id} value={spot.id}>
                    {spot.name} — {spot.landmark} ({spot.timing})
                  </option>
                ))}
              </select>
            </div>

            {/* Smart Swap Options */}
            <div className="sm:col-span-2 p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
              <label className="flex items-center space-x-2 font-bold text-indigo-900">
                <input
                  type="checkbox"
                  checked={formData.isExchangeAvailable}
                  onChange={(e) => setFormData({ ...formData, isExchangeAvailable: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Enable Smart Swap (Allow other students to propose barters)</span>
              </label>
              {formData.isExchangeAvailable && (
                <input
                  type="text"
                  placeholder="What items or textbooks are you looking for in return?"
                  value={formData.exchangeWantedNotes}
                  onChange={(e) => setFormData({ ...formData, exchangeWantedNotes: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-indigo-200 bg-white"
                />
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Description for Buyers</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Back to Photos
            </button>
            <button
              onClick={handleProceedToScan}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition flex items-center space-x-1.5 shadow-soft"
            >
              <span>Next: AI Vision Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI VISION SCAN */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-navy-900">Step 3: Computer Vision Surface Inspection</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our vision model scans your uploaded photographs for surface degradation, cover folds, and hardware defects.
            </p>
          </div>

          {isScanning ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-brand-blue border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-navy-900">Running Computer Vision Diagnostics...</p>
            </div>
          ) : visionScan ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">Visual Condition Confirmed</span>
                  <span className="text-emerald-700">Estimated surface wear: {visionScan.wearPercentage}%</span>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-bold text-[11px]">
                  {visionScan.confidence}% Match
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Inspection Notes:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                  {visionScan.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Back to Details
                </button>
                <button
                  onClick={handleProceedToPrediction}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition flex items-center space-x-1.5 shadow-soft"
                >
                  <span>Generate ML Price Valuation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* STEP 4 & 5: PRICE QUOTATION & DEAL SCORE */}
      {(currentStep === 4 || currentStep === 5) && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {isPredicting ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-brand-green border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-navy-900">Calculating Fair Campus Valuation...</p>
            </div>
          ) : prediction ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Step 5: Fair Valuation & Deal Score</h2>
                <p className="text-xs text-slate-500 mt-1">
                  XGBoost + Random Forest ensemble valuation based on {formData.category} campus retention.
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  AI Recommended Fair Listing Price
                </span>
                <span className="text-4xl font-black text-navy-900">
                  ₹{prediction.suggestedPrice}
                </span>
                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 pt-1">
                  <span>Fair Range: <strong>₹{prediction.minPrice} - ₹{prediction.maxPrice}</strong></span>
                  <span>•</span>
                  <span>Confidence: <strong>{prediction.confidencePercentage}%</strong></span>
                </div>
              </div>

              {/* Deal Score Preview */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 font-extrabold text-emerald-900">
                    <Zap className="w-4 h-4 text-brand-green fill-current" />
                    <span>Predicted Deal Grade: {previewDealScore.grade}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">{previewDealScore.assessmentNote}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-bold text-xs">
                  {previewDealScore.scoreOutOf100}/100
                </span>
              </div>

              {/* Manual Override Option */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Your Chosen Selling Price (You have full manual control):
                  </label>
                  <span className="text-xs font-bold text-brand-blue">₹{finalPrice}</span>
                </div>
                <input
                  type="range"
                  min={Math.round(prediction.minPrice * 0.7)}
                  max={Math.round(prediction.maxPrice * 1.3)}
                  step={10}
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Below Average (Faster Sale)</span>
                  <span>Balanced Fair Value</span>
                  <span>Premium Value</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Edit Information
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-2xl text-xs font-bold hover:bg-blue-600 transition flex items-center space-x-1.5 shadow-soft"
                >
                  <span>Review & Publish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* STEP 6: REVIEW & PUBLISH */}
      {currentStep === 6 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Step 6: Review & Finalize Campus Listing</h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify listing parameters before circulating across student community members.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Title:</span>
              <span className="font-bold text-navy-900 text-right">{formData.title}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Category & Condition:</span>
              <span className="font-semibold">{formData.category} • {formData.condition}</span>
            </div>
            {formData.edition && (
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Edition / ISBN:</span>
                <span className="font-semibold">{formData.edition} {formData.isbn ? `• ${formData.isbn}` : ''}</span>
              </div>
            )}
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Listed Price:</span>
              <span className="font-black text-navy-900 text-sm">₹{finalPrice}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Campus Handover Location:</span>
              <span className="font-semibold text-emerald-800">
                {currentInstitution.safeHandoverSpots.find(s => s.id === formData.pickupSpotId)?.name || 'Central Library Foyer'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Smart Swap Availability:</span>
              <span className="font-semibold">{formData.isExchangeAvailable ? 'Yes (Open to barter)' : 'Cash sale only'}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              onClick={handlePublish}
              className="px-8 py-3 bg-brand-green hover:bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold transition shadow-elevated flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing to Campus</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      <BookScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onApply={handleApplyScannerData}
      />
    </div>
  );
}
