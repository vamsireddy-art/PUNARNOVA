import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1F33] text-slate-300 text-xs border-t border-[#132B45] pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#1E3E61] bg-[#071422] shrink-0 p-1">
                <Image
                  src="/logo.png"
                  alt="PunarNova Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Punar<span className="text-[#10B981]">Nova</span>
                </span>
                <span className="text-[10px] block text-slate-400 tracking-wider">
                  Verified Campus Network
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Peer-to-peer university educational marketplace. Buy, sell, and swap verified curriculum textbooks, calculators, and instruments with students at your institution.
            </p>
            <div className="flex items-center space-x-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="font-medium">Verified Student Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link href="/buy" className="hover:text-[#10B981] transition-colors">Browse Textbooks & Gear</Link></li>
              <li><Link href="/sell" className="hover:text-[#10B981] transition-colors">List an Item</Link></li>
              <li><Link href="/exchange" className="hover:text-[#10B981] transition-colors">Campus Smart Swap</Link></li>
              <li><Link href="/verification" className="hover:text-[#10B981] transition-colors">Student Verification</Link></li>
              <li><Link href="/sustainability" className="hover:text-[#10B981] transition-colors">Environmental Ledger</Link></li>
            </ul>
          </div>

          {/* Educational Categories */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/buy?category=Engineering+Books" className="hover:text-[#10B981] transition-colors">Engineering Textbooks</Link></li>
              <li><Link href="/buy?category=Calculators" className="hover:text-[#10B981] transition-colors">Scientific Calculators</Link></li>
              <li><Link href="/buy?category=Medical+Books" className="hover:text-[#10B981] transition-colors">Medical & Anatomy</Link></li>
              <li><Link href="/buy?category=Drawing+Instruments" className="hover:text-[#10B981] transition-colors">Drafting & Instruments</Link></li>
              <li><Link href="/buy?category=Lab+Equipment" className="hover:text-[#10B981] transition-colors">Laboratory Supplies</Link></li>
            </ul>
          </div>

          {/* Trust & Safety & Indian Data Protection */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Privacy & Trust</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Built with privacy-first student protections. Institutional credentials are encrypted, verified via domain tokens, and never exposed to peers.
            </p>
            <div className="p-3.5 rounded-xl bg-[#132B45] border border-[#1E3E61] text-[11px] space-y-1">
              <span className="text-[#10B981] font-bold flex items-center">
                <Leaf className="w-3 h-3 mr-1" />
                DPDP Act & Student Data Safeguards
              </span>
              <p className="text-slate-400">
                Peer interactions take place exclusively inside verified campus perimeters.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#132B45] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} PunarNova Technologies. Built for sustainable campus education.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 transition-colors">Security Safeguards</span>
            <span className="hover:text-slate-300 transition-colors">Campus Guidelines</span>
            <span className="hover:text-slate-300 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
