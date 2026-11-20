'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, Heart, PackageCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function BottomNav() {
  const pathname = usePathname();
  const { wishlist } = useAppStore();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Buy', href: '/buy', icon: Compass },
    { label: 'Sell', href: '/sell', icon: PlusCircle, isPrimary: true },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlist.length },
    { label: 'Orders', href: '/orders', icon: PackageCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-elevated border-4 border-white active:scale-95 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-brand-blue mt-0.5">Sell</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 relative transition ${
                isActive ? 'text-brand-blue font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
