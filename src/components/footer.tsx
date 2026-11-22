import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-navy-900 shrink-0">
                <Image
                  src="/logo.png"
                  alt="PunarNova Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-white tracking-tight">
                  Punar<span className="text-brand-blue ml-0.5">Nova</span>
                </span>
                <span className="text-[10px] block text-slate-400 tracking-wider">
                  Discover • Reuse • Grow
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              The premier circular economy student marketplace. Buy, sell, and exchange textbooks, calculators, and educational gear with verified peers at your institution.
            </p>
            <div className="flex items-center space-x-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Verified Student Peer Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link href="/buy" className="hover:text-white transition">Buy Textbooks & Gear</Link></li>
              <li><Link href="/sell" className="hover:text-white transition">AI Price Estimation & Sell</Link></li>
              <li><Link href="/exchange" className="hover:text-white transition">Student-to-Student Exchange</Link></li>
              <li><Link href="/verification" className="hover:text-white transition">Student ID Verification</Link></li>
              <li><Link href="/sustainability" className="hover:text-white transition">Campus Eco Dashboard</Link></li>
            </ul>
          </div>

          {/* Educational Categories */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/buy?category=Engineering+Books" className="hover:text-white transition">Engineering Books</Link></li>
              <li><Link href="/buy?category=Calculators" className="hover:text-white transition">Scientific Calculators</Link></li>
              <li><Link href="/buy?category=Medical+Books" className="hover:text-white transition">Medical Books</Link></li>
              <li><Link href="/buy?category=Drawing+Instruments" className="hover:text-white transition">Drawing & Drafting Tools</Link></li>
              <li><Link href="/buy?category=Lab+Equipment" className="hover:text-white transition">Lab Coats & Apparatus</Link></li>
            </ul>
          </div>

          {/* Trust & Safety & Indian Data Protection */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Trust & Safety</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Built with privacy-first student safeguards. Identity documents are encrypted, restricted, and never exposed publicly.
            </p>
            <div className="p-3 rounded-lg bg-navy-900 border border-slate-800 text-[11px] space-y-1">
              <span className="text-brand-green font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> DPDP Act & Child Data Safeguards Compliant
              </span>
              <p className="text-slate-500">
                School student identities protected with institutional tokenization.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PunarNova Marketplace. Built for sustainable student education.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Campus Handover</span>
            <span>Dispute Resolution</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
