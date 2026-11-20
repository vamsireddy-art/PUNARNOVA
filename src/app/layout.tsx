import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Navbar } from '@/components/navbar';
import { BottomNav } from '@/components/bottom-nav';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'PunarNova - Verified Student Second-Hand Marketplace',
  description: 'Buy, sell, and exchange pre-owned textbooks, scientific calculators, and educational gear with verified peers at your institution. Powered by AI price estimation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-blue selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
