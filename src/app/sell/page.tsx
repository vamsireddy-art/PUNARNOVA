'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Lock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductCondition, AIPricePredictionResult, AIImageScanResult, Product } from '@/types';
import { requestPricePrediction, requestImageAnalysis } from '@/lib/ml-client';
import { VerificationModal } from '@/components/verification-modal';

export default function SellWizardPage() {
  const router = useRouter();
  const { currentUser, selectedCampus, addProduct } = useAppStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Step 1: Upload Images (3-5)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
  ]);

  // Step 2: Questionnaire
  const [formData, setFormData] = useState({
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    category: 'Calculators',
    brand: 'Casio',
    modelNumber: 'fx-991EX',
    originalPrice: 1595,
    purchaseDate: '2023-08',
    usageMonths: 12,
    condition: 'Good' as ProductCondition,
    hasDamages: false,
    damageNotes: 'Minor scuff on battery sliding compartment, screen crystal clear',
    hasAccessories: true,
    hasPackaging: false,
    pickupNotes: 'Hostel 12 Gate or Central Library Foyer',
    deliveryAvailable: true,
    isExchangeAvailable: true,
    description: 'Casio ClassWiz 552 functions. Used during Semester 1 & 2 engineering calculus. All matrix and equation modes work perfectly with new battery.',
  });

  // Step 3: AI Vision Scan Results
  const [isScanning, setIsScanning] = useState(false);
  const [visionScan, setVisionScan] = useState<AIImageScanResult | null>(null);

  // Step 4 & 5: ML Price Prediction
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<AIPricePredictionResult | null>(null);
  const [customPriceChosen, setCustomPriceChosen] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number>(750);

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

  // Step 6: Publish Listing
  const handlePublish = () => {
    // Check verification guard
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
      institutionId: currentUser.institutionId || selectedCampus?.id || 'inst-1',
      institutionName: currentUser.institutionName || selectedCampus?.name || 'IIT Bombay',
      categoryId: `cat-${Date.now()}`,
      categoryName: formData.category,
      title: formData.title,
      description: formData.description,
      brand: formData.brand,
      modelNumber: formData.modelNumber,
      condition: formData.condition,
      originalPrice: Number(formData.originalPrice),
      sellingPrice: Number(finalPrice),
      aiEstimatedPrice: prediction?.suggestedPrice,
      suggestedMinPrice: prediction?.minPrice,
      suggestedMaxPrice: prediction?.maxPrice,
      aiConfidenceScore: prediction?.confidencePercentage,
      images,
      isNegotiable: true,
      isExchangeAvailable: formData.isExchangeAvailable,
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
      {/* Verification Warning Banner if not verified */}
      {currentUser.verificationStatus !== 'verified' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Student Verification Required to Publish</p>
              <p className="text-amber-700">
                You can generate price quotes anytime, but publishing listings requires an approved student ID.
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
      )}

      {/* Wizard Header & Stepper */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Smart Selling System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
          Sell Product & Estimate Resale Value
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Our computer vision and ML pricing models evaluate historical sales, wear, and demand to give you a fair market quote.
        </p>

        {/* 6 Step Progress Indicator */}
        <div className="pt-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-[11px] font-semibold text-slate-400">
            {[
              { num: 1, label: 'Photos' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'AI Vision' },
              { num: 4, label: 'ML Price' },
              { num: 5, label: 'Quotation' },
              { num: 6, label: 'Publish' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 transition ${
                    currentStep === step.num
                      ? 'bg-brand-blue text-white ring-4 ring-blue-100'
                      : currentStep > step.num
                      ? 'bg-brand-green text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className={currentStep === step.num ? 'text-brand-blue font-bold' : ''}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD PRODUCT IMAGES */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Step 1: Upload Product Photographs</h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload 3 to 5 clear photographs (Front, Back, Condition details, and visible wear). Formats: JPG, PNG, WebP.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                  {idx === 0 ? 'Front' : idx === 1 ? 'Back' : idx === 2 ? 'Detail' : 'Angle'}
                </span>
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition p-4 text-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Add Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">3-5 recommended</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImages([...images, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']);
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={images.length < 2}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition flex items-center space-x-1.5"
            >
              <span>Next: Product Information</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRODUCT INFORMATION (10 QUESTIONS) */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Step 2: Educational Product Questionnaire</h2>
            <p className="text-xs text-slate-500 mt-1">
              Answer 10 short questions to calibrate the depreciation curves and resale price model.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Q1: Product Name */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">1. Product Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Q2: Category */}
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

            {/* Q3: Brand / Publisher */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">3. Brand / Publisher</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Q4: Original Purchase Price */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">4. Original Purchase Price (₹ INR)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Q5 & Q6: Usage Duration */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">5 & 6. Usage Duration (Months)</label>
              <input
                type="number"
                value={formData.usageMonths}
                onChange={(e) => setFormData({ ...formData, usageMonths: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {/* Q7: Current Condition */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">7. What is its current condition?</label>
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

            {/* Q8: Damages */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">8. Are there any visible damages or torn pages?</label>
              <div className="flex items-center space-x-4 mb-2">
                <label className="flex items-center space-x-1.5">
                  <input
                    type="radio"
                    name="damages"
                    checked={!formData.hasDamages}
                    onChange={() => setFormData({ ...formData, hasDamages: false })}
                  />
                  <span>No visible damage</span>
                </label>
                <label className="flex items-center space-x-1.5">
                  <input
                    type="radio"
                    name="damages"
                    checked={formData.hasDamages}
                    onChange={() => setFormData({ ...formData, hasDamages: true })}
                  />
                  <span>Minor wear / marks present</span>
                </label>
              </div>
              {formData.hasDamages && (
                <input
                  type="text"
                  placeholder="Describe damage..."
                  value={formData.damageNotes}
                  onChange={(e) => setFormData({ ...formData, damageNotes: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              )}
            </div>

            {/* Q9 & Q10: Accessories & Packaging */}
            <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
              <label className="flex items-center space-x-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.hasAccessories}
                  onChange={(e) => setFormData({ ...formData, hasAccessories: e.target.checked })}
                  className="rounded text-brand-blue focus:ring-brand-blue"
                />
                <span>9. All original accessories / covers included (+5% resale bonus)</span>
              </label>

              <label className="flex items-center space-x-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.hasPackaging}
                  onChange={(e) => setFormData({ ...formData, hasPackaging: e.target.checked })}
                  className="rounded text-brand-blue focus:ring-brand-blue"
                />
                <span>10. Original packaging / manual available (+5% bonus)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <button
              onClick={handleProceedToScan}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition flex items-center space-x-1.5"
            >
              <span>Next: AI Vision Analysis</span>
              <Sparkles className="w-4 h-4 text-brand-green" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI IMAGE COMPUTER VISION ANALYSIS */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-brand-blue" />
                <span>Step 3: Pretrained Computer Vision Analysis</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Visual feature extraction identifies product category, edge defects, and wear estimation.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-blue-50 text-brand-blue px-2.5 py-1 rounded-full font-bold">
              CV Model: WearNet-v1.8
            </span>
          </div>

          {isScanning ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-blue-500 border-t-transparent animate-spin mx-auto" />
              <p className="font-bold text-navy-900 text-sm">Analyzing Product Photographs...</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Scanning texture patterns, edge crispness, and identifying brand logos across {images.length} frames.
              </p>
            </div>
          ) : visionScan ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Detected Category</span>
                  <span className="font-bold text-navy-900 text-sm">{visionScan.detectedCategory}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Visual Wear Index</span>
                  <span className="font-bold text-emerald-600 text-sm">{visionScan.wearPercentage}% Surface Wear</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">CV Scan Confidence</span>
                  <span className="font-bold text-brand-blue text-sm">{visionScan.confidence}% Match</span>
                </div>
              </div>

              {/* Inspection Notes */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-blue-900 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-brand-green mr-1.5" />
                  Visual Diagnostics & Findings:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {visionScan.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>

              {/* Requirement: Prompt seller to confirm condition */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span>Visual condition matches: <strong>{formData.condition}</strong></span>
                <span className="text-[11px] text-amber-700 font-medium">Seller confirmed ✓</span>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <button
              onClick={handleProceedToPrediction}
              disabled={isScanning}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition flex items-center space-x-1.5"
            >
              <span>Run ML Price Prediction</span>
              <TrendingUp className="w-4 h-4 text-brand-green" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 & 5: AI PRICE QUOTATION CARD */}
      {currentStep === 5 && prediction && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-elevated space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-brand-green text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Price Quotation Generated</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                Suggested Resale Price: ₹{prediction.suggestedPrice.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                {prediction.confidencePercentage}% Confidence Score
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">{prediction.modelName}</p>
            </div>
          </div>

          {/* Suggested Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Suggested Minimum</span>
              <span className="text-lg font-bold text-slate-700">₹{prediction.minPrice}</span>
              <span className="text-[10px] text-slate-400 block">Fast liquidation</span>
            </div>
            <div className="p-4 bg-blue-50/80 border-2 border-brand-blue rounded-xl">
              <span className="text-[11px] text-brand-blue font-bold block">Recommended Price</span>
              <span className="text-2xl font-black text-navy-900">₹{prediction.suggestedPrice}</span>
              <span className="text-[10px] text-brand-blue font-medium block">Optimal campus demand</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Suggested Maximum</span>
              <span className="text-lg font-bold text-slate-700">₹{prediction.maxPrice}</span>
              <span className="text-[10px] text-slate-400 block">High value retention</span>
            </div>
          </div>

          {/* Pricing Explanation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-navy-900 flex items-center">
              <HelpCircle className="w-4 h-4 text-brand-blue mr-1.5" />
              Machine Learning Valuation Explanation:
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {prediction.pricingExplanation}
            </p>
          </div>

          {/* TWO MANDATORY BUTTONS: Accept Suggested Price vs Enter Custom Price */}
          <div className="pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCustomPriceChosen(false);
                  setFinalPrice(prediction.suggestedPrice);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border-2 transition flex items-center justify-center space-x-2 ${
                  !customPriceChosen
                    ? 'border-brand-blue bg-blue-50 text-brand-blue ring-2 ring-blue-100'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Suggested Price (₹{prediction.suggestedPrice})</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomPriceChosen(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border-2 transition flex items-center justify-center space-x-2 ${
                  customPriceChosen
                    ? 'border-brand-blue bg-blue-50 text-brand-blue ring-2 ring-blue-100'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Enter My Own Custom Price</span>
              </button>
            </div>

            {customPriceChosen && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 text-xs">
                <span className="font-bold text-slate-700">Set Final Selling Price:</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="pl-6 pr-3 py-1.5 rounded-lg border border-slate-300 font-bold text-navy-900 w-32 focus:outline-none"
                  />
                </div>
                <span className="text-slate-400 text-[11px]">(You have the final decision)</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Re-estimate
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition flex items-center space-x-1.5"
            >
              <span>Next: Review & Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PRODUCT LISTING REVIEW & PUBLISH */}
      {currentStep === 6 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Step 6: Preview Listing & Campus Handover</h2>
            <p className="text-xs text-slate-500 mt-1">
              Confirm your title, final selling price, and campus pickup arrangements before publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Listing Details Edit */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Listing Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Handover Location Notes</label>
                <input
                  type="text"
                  value={formData.pickupNotes}
                  onChange={(e) => setFormData({ ...formData, pickupNotes: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* Final Summary Card */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Listing Summary</h3>
              <div className="flex items-center space-x-3">
                <img src={images[0]} alt="Thumbnail" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div>
                  <h4 className="font-bold text-navy-900 text-xs line-clamp-1">{formData.title}</h4>
                  <p className="text-slate-500 text-[11px]">{formData.category} • {formData.condition}</p>
                  <p className="text-base font-extrabold text-brand-blue mt-1">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Seller Verification:</span>
                  <span className={currentUser.verificationStatus === 'verified' ? 'text-brand-green font-bold' : 'text-amber-600 font-bold'}>
                    {currentUser.verificationStatus === 'verified' ? 'Verified Student ✓' : 'Verification Required'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Institution:</span>
                  <span className="font-medium text-slate-800">{currentUser.institutionName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exchange Available:</span>
                  <span>{formData.isExchangeAvailable ? 'Yes (Book Barter)' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <button
              onClick={handlePublish}
              className="px-8 py-3 bg-brand-green hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl shadow-soft hover:shadow-md transition active:scale-95 flex items-center space-x-2"
            >
              <FileCheck className="w-5 h-5" />
              <span>PUBLISH PRODUCT</span>
            </button>
          </div>
        </div>
      )}

      {/* Verification Modal if unverified */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={() => setShowVerificationModal(false)}
      />
    </div>
  );
}
