# ReUse Campus - Production Student Educational Marketplace

> A production-ready, mobile-friendly circular economy marketplace connecting students and educational communities to buy, sell, and exchange pre-owned educational products at affordable, fair prices.

---

## 🌟 Key Features

### 1. Dual Core Engine: Buy & Sell
- **Main Dashboard**: Prominent BUY and SELL call-to-actions, campus switcher (IIT Bombay, BITS Pilani, Delhi University, etc.), geolocation proximity detection, featured, recent, and popular educational items.
- **Buy Marketplace**: Full-text instant search by Product name, Book title, Author, ISBN, Subject, Brand, and Category across 12 educational categories.
- **Filters**: Price slider (₹100 to ₹5,000), Condition, Institution Campus, Walking Distance, and Verified Student Seller toggle.
- **Product Details**: Multi-angle image gallery with thumbnail preview, condition breakdown, seller verification badge, campus handover notes, instant chat/negotiation, and similar recommendations.

### 2. Sell Module – AI-Powered Price Prediction (The Core Innovation)
- **Step 1 (Upload Photographs)**: 3–5 photos (front, back, condition, brand/model, visible wear). Supports JPG, PNG, WebP.
- **Step 2 (Questionnaire)**: 10 structured domain questions (product name, category, brand, original purchase price, usage duration, current condition, visible damages, accessories, original packaging).
- **Step 3 (AI Vision Analysis)**: Computer vision scanning for surface wear score, binding integrity, and edge defects with seller confirmation prompt.
- **Step 4 (ML Price Prediction)**: Machine learning regression (Random Forest + XGBoost ensemble) combining age depreciation curve, condition factor, accessories bonus (+5%), packaging (+5%), and campus demand multiplier.
- **Step 5 (AI Price Quotation)**: Displays suggested price, minimum price, maximum price, confidence percentage, and human-friendly explanation with **Accept Suggested Price** and **Enter My Own Price** buttons.
- **Step 6 (Publish Listing)**: Campus handover location notes, description, preview, and verified publish.

### 3. Trust & Seller Verification System
- **Verification for Students**: Student ID Card upload, Bonafide certificate, or verified institutional email (`@iitb.ac.in`, `@bits-pilani.ac.in`, etc.).
- **Strict Privacy (DPDP Act Compliance)**:
  - Identity cards are stored in an encrypted vault and **never** exposed to buyers or public profiles.
  - Automated fuzzy name reconciliation: minor spelling discrepancies mark status as **Pending Review** instead of rejecting legitimate students.
  - Only verified accounts can publish listings.

### 4. Additional Modules
- **Student-to-Student Exchange**: Direct zero-cash book and equipment swapping.
- **Buyer-Seller In-App Chat**: Safe messaging with product preview, counter-offer negotiation, report user, and block user without exposing personal phone numbers.
- **Campus Sustainability Dashboard**: Real-time campus metrics (products reused, CO₂ emissions prevented, student money saved, water saved) with transparent lifecycle methodology explanations.
- **Order Management & Handover Codes**: 4-digit pickup handover verification code (`#4821`) to protect buyers and sellers during physical item exchanges.
- **Admin Console**: Moderation queue for student ID approvals/rejections, flagged product moderation, and AI engine diagnostics (MAE: ₹34.20, RMSE: ₹49.80, R²: 0.941).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Next.js REST API Routes, Node.js v22 |
| **Database & Auth** | Supabase PostgreSQL, Row Level Security (RLS), Supabase Storage |
| **AI / Machine Learning** | Python 3.13, FastAPI, Scikit-learn, XGBoost, WearNet CV |
| **Integrations** | Razorpay Test Mode, SMS OTP verification, Google OAuth, Geolocation API |

---

## 📂 Project Directory Structure

```
project_reddy/
├── ml_service/                  # Python FastAPI AI / ML Valuation Service
│   ├── main.py                  # FastAPI server with ML regression & CV endpoints
│   └── requirements.txt         # Python dependencies
├── supabase/
│   └── schema.sql               # Complete SQL schema with all 24 PostgreSQL tables & RLS
├── src/
│   ├── app/
│   │   ├── page.tsx             # Main Marketplace Dashboard
│   │   ├── buy/page.tsx         # Buy Module with instant filters & search
│   │   ├── product/[id]/        # Product Details Page & Gallery
│   │   ├── sell/page.tsx        # 6-Step Smart AI Selling System
│   │   ├── cart/page.tsx        # Cart & fee breakdown
│   │   ├── checkout/page.tsx    # Campus handover & Razorpay test mode
│   │   ├── orders/page.tsx      # My Orders & Pickup Codes
│   │   ├── wishlist/page.tsx    # Wishlist & Saved Items
│   │   ├── exchange/page.tsx    # Student-to-Student Barter Module
│   │   ├── verification/        # Student Seller Verification Center
│   │   ├── admin/page.tsx       # Admin Moderation & AI Diagnostics
│   │   ├── sustainability/      # Circular Economy Impact Dashboard
│   │   ├── auth/signup/         # Sign Up with SMS OTP & Institution selector
│   │   ├── auth/signin/         # Sign In with Persona quick switcher
│   │   └── api/                 # Next.js API Routes (products, verify, ml proxy)
│   ├── components/              # Navbar, BottomNav, ProductCard, ChatModal, VerificationModal, etc.
│   ├── lib/                     # Client store, Mock data, ML client, Supabase config
│   └── types/                   # TypeScript entity definitions (all 24 models)
├── .env.example                 # Documented environment variables
├── package.json                 # Next.js dependencies
└── tailwind.config.ts           # Deep Navy Blue (#0F172A), Soft Blue, Fresh Green palette
```

---

## 🚀 Quick Start Guide

### 1. Run the Web Application
```bash
# In the project root directory:
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run the Python AI / ML Service (Optional daemon)
The application has client-side ML regression fallback built in, but to run the Python FastAPI service:
```bash
cd ml_service
python -m pip install -r requirements.txt
python main.py
```
The ML API service runs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 3. Connect Supabase Database
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. In your Supabase dashboard SQL editor, execute `supabase/schema.sql`. It will automatically provision all 24 required tables, foreign keys, performance indexes, and strict Row Level Security (RLS) policies.

---

## 👥 Demo Personas (One-Click Switcher in Navbar)
You can test all user journeys directly using the Persona switcher in the top banner:
1. **Verified Student (`Aarav Sharma`)**: Full buyer and seller privileges, verified student badge, active listings.
2. **Pending Student (`Priya Patel`)**: Demonstrates the verification gate (can get AI quotes, but prompts for ID verification before publishing).
3. **Campus Admin (`Prof. Vikram Malhotra`)**: Opens the `/admin` portal with moderation queues and AI price engine telemetry.
