import { DealScoreResult, DealGrade, Product } from '@/types';

/**
 * Calculate dynamic AI Deal Score for an educational item.
 * Evaluates the item's selling price against:
 * 1. Category median price
 * 2. Original retail price (depreciation value)
 * 3. Item condition expectations
 */
export function calculateDealScore(
  sellingPrice: number,
  originalPrice: number,
  categoryName: string,
  condition: string,
  existingProducts: Product[] = []
): DealScoreResult {
  const orig = Math.max(originalPrice, 50);
  const sell = Math.max(sellingPrice, 10);

  // 1. Calculate category median or fallback benchmark
  const categoryItems = existingProducts.filter(
    (p) => p.categoryName.toLowerCase() === categoryName.toLowerCase() && p.sellingPrice > 0
  );

  let categoryMedianPrice: number;
  if (categoryItems.length >= 2) {
    const prices = categoryItems.map((p) => p.sellingPrice).sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);
    categoryMedianPrice = prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
  } else {
    // Benchmark default if insufficient historical category data
    categoryMedianPrice = Math.round(orig * 0.55);
  }

  // 2. Expected condition discount factor
  const conditionFairFraction: Record<string, number> = {
    'Like New': 0.65,
    'Excellent': 0.55,
    'Good': 0.45,
    'Fair': 0.35,
    'Needs Repair': 0.20,
  };
  const expectedFraction = conditionFairFraction[condition] || 0.48;
  const benchmarkFairPrice = Math.round(orig * expectedFraction);

  // 3. Difference from benchmark
  const discountVsOriginal = ((orig - sell) / orig) * 100;
  const discountVsMedian = ((categoryMedianPrice - sell) / categoryMedianPrice) * 100;

  // 4. Score calculation out of 100
  let score = 50 + (discountVsMedian * 0.6) + (discountVsOriginal * 0.2);
  score = Math.max(10, Math.min(Math.round(score), 99));

  // 5. Grade Assignment
  let grade: DealGrade = 'Fair Price';
  let assessmentNote = `Priced around campus fair value of ₹${benchmarkFairPrice}.`;

  if (discountVsMedian >= 40 || discountVsOriginal >= 60) {
    grade = 'Steal Deal';
    assessmentNote = `Exceptional bargain! Priced ${Math.round(Math.max(discountVsMedian, discountVsOriginal))}% below typical value.`;
  } else if (discountVsMedian >= 20 || discountVsOriginal >= 45) {
    grade = 'Great Value';
    assessmentNote = `High student value. Saves ₹${Math.round(orig - sell)} compared to retail price.`;
  } else if (sell > categoryMedianPrice * 1.15) {
    grade = 'Above Average';
    assessmentNote = `Priced above the campus median (₹${Math.round(categoryMedianPrice)}). Consider negotiating.`;
  }

  return {
    grade,
    percentageBelowMedian: Math.max(0, Math.round(discountVsMedian)),
    categoryMedianPrice: Math.round(categoryMedianPrice),
    scoreOutOf100: score,
    assessmentNote,
  };
}
