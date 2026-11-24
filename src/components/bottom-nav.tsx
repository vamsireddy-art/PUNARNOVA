'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Plus, Heart, PackageCheck, Repeat, Store } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function BottomNav() {
  const pathname = usePathname();
  const { wishlist } = useAppStore();

  const navItems = [
    { label: 'Explore', href: '/buy', icon: Store },
    { label: 'Swap', href: '/exchange', icon: Repeat },
    { label: 'List Item', href: '/sell', icon: Plus, isPrimary: true },
    { label: 'Saved', href: '/wishlist', icon: Heart, badge: wishlist.length },
    { label: 'Orders', href: '/orders', icon: PackageCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] py-1.5 px-3 shadow-[0_-2px_10px_rgba(11,31,51,0.04)] safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3.5 group"
              >
                <div className="w-11 h-11 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] flex items-center justify-center shadow-md border-2 border-white group-active:scale-95 transition-all">
                  <Icon className="w-5 h-5 stroke-[2.4]" />
                </div>
                <span className="text-[10px] font-bold text-[#0B1F33] mt-1">Sell</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 relative transition-colors ${
                isActive ? 'text-[#10B981] font-semibold' : 'text-[#64748B] hover:text-[#0B1F33]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#10B981] text-[#0B1F33] text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
