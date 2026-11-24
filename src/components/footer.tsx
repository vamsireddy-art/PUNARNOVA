import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-850 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                <Image
                  src="/logo.png"
                  alt="PunarNova Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-white tracking-tight">
                  PunarNova
                </span>
                <span className="text-[10px] block text-slate-400 tracking-wider">
                  Verified Campus Network
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Peer-to-peer university educational marketplace. Buy, sell, and swap verified curriculum textbooks, calculators, and instruments with students at your institution.
            </p>
            <div className="flex items-center space-x-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Student Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link href="/buy" className="hover:text-white transition-colors">Browse Textbooks & Gear</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">List an Item</Link></li>
              <li><Link href="/exchange" className="hover:text-white transition-colors">Campus Smart Swap</Link></li>
              <li><Link href="/verification" className="hover:text-white transition-colors">Student Verification</Link></li>
              <li><Link href="/sustainability" className="hover:text-white transition-colors">Environmental Ledger</Link></li>
            </ul>
          </div>

          {/* Educational Categories */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/buy?category=Engineering+Books" className="hover:text-white transition-colors">Engineering Textbooks</Link></li>
              <li><Link href="/buy?category=Calculators" className="hover:text-white transition-colors">Scientific Calculators</Link></li>
              <li><Link href="/buy?category=Medical+Books" className="hover:text-white transition-colors">Medical & Anatomy</Link></li>
              <li><Link href="/buy?category=Drawing+Instruments" className="hover:text-white transition-colors">Drafting & Instruments</Link></li>
              <li><Link href="/buy?category=Lab+Equipment" className="hover:text-white transition-colors">Laboratory Supplies</Link></li>
            </ul>
          </div>

          {/* Trust & Safety & Indian Data Protection */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Privacy & Trust</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Built with privacy-first student protections. Institutional credentials are encrypted, verified via domain tokens, and never exposed to peers.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <span className="text-emerald-400 font-medium">
                DPDP Act & Student Data Safeguards
              </span>
              <p className="text-slate-500">
                Peer interactions take place exclusively inside verified campus perimeters.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PunarNova Campus Marketplace. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Handover Guidelines</span>
            <span>Safety Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
