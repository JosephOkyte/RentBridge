'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  AlertTriangle, 
  ArrowLeft, 
  Layers, 
  Building2,
  Users
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const adminNav = [
    { name: 'Citadel Overview', href: '/admin', icon: Layers, badge: 'Operations Hub' },
    { name: 'Phase 1 Verification Desk', href: '/admin/verification', icon: ShieldCheck, badge: 'Gatekeeper' },
    { name: 'Stealth Account Monitor', href: '/admin/accounts', icon: Users, badge: 'Silent Audit' },
    { name: 'Anti-Fraud Incident Room', href: '/admin/fraud', icon: AlertTriangle, badge: 'Extortion Watch' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151816]">
      {/* Top Admin Bar */}
      <header className="bg-[#151816] text-white border-b border-[#252926] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2D5A43] text-white flex items-center justify-center font-bold text-sm">
                RB
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                RentBridge <span className="text-[#8AE0B3]">Compliance Operations</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider">
              Internal Staff Only
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lister Portal</span>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Secondary Sub-Navigation */}
        <div className="border-t border-white/10 bg-[#1E3F2F]/60 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#2D5A43] text-white shadow-sm'
                      : 'text-[#E2D7C8] hover:bg-white/10'
                  }`}>
                  <Icon className="w-3.5 h-3.5 text-[#8AE0B3]" />
                  <span>{item.name}</span>
                  <span className="text-[9px] bg-black/40 px-1.5 py-0.2 rounded font-mono text-[#8AE0B3]">
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Back Action Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]/60">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/dashboard/admin');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8DFC8] text-xs font-bold text-[#4B524D] hover:text-[#151816] hover:bg-[#F5EFEB] transition-all shadow-xs group cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5 text-[#2D5A43] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin"
              className="px-3 py-1.5 rounded-lg bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold hover:bg-[#2D5A43] hover:text-white transition-all">
              Citadel Dashboard
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#8F8372] hover:text-[#151816]">
              Marketplace
            </Link>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

