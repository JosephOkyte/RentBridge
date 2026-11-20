'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { ShieldCheck, MapPin, Building2, PlusCircle, Menu, X, Calculator, Home, Info, User, LayoutDashboard, Sparkles } from 'lucide-react';
import { WHATSAPP_DIRECT_URL, WhatsAppIcon } from '../utils/whatsapp';

export default function Navbar({ onOpenListModal, onNavigateToSection }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Universal navigation handler: smooth scroll if on homepage, else route to /#sectionId
  const handleNav = (sectionId) => {
    if (pathname === '/') {
      if (onNavigateToSection) {
        onNavigateToSection(sectionId);
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(`/#${sectionId}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/98 backdrop-blur-md border-b border-[#E8DFC8] shadow-xs">
      {/* Top Header Row: Logo & Action CTAs */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <Link 
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2D5A43] flex items-center justify-center text-[#FBF9F5] shadow-md shadow-[#2D5A43]/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 13V11C3 7.68629 5.68629 5 9 5H15C18.3137 5 21 7.68629 21 11V13M3 13H21M3 13V19M21 13V19M8 13V19M16 13V19" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#151816]">
                  Rent<span className="text-[#2D5A43]">Bridge</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20">
                  NG
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#4B524D] font-medium leading-none mt-0.5 hidden xs:block">
                Bridging landlords & tenants
              </p>
            </div>
          </Link>

          {/* Header Action Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            {mounted && isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#4B524D] hover:text-[#151816] hover:bg-[#F5EFEB] transition-all cursor-pointer">
                    <span>Sign In</span>
                  </button>
                </SignInButton>

                <Link
                  href="/get-started"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-[#2D5A43] text-white hover:bg-[#1E3F2F] transition-all shadow-xs cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </>
            )}
            {mounted && isLoaded && isSignedIn && (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#EBF2ED] text-[#2D5A43] hover:bg-[#2D5A43] hover:text-white transition-all cursor-pointer">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 ring-2 ring-[#2D5A43]/30',
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Action CTAs (Mobile) */}
          <div className="sm:hidden flex items-center gap-2">
            {mounted && isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#4B524D] bg-[#F5EFEB] border border-[#E8DFC8]">
                    Sign In
                  </button>
                </SignInButton>
                <Link
                  href="/get-started"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#2D5A43] shadow-xs">
                  Join
                </Link>
              </>
            )}
            {mounted && isLoaded && isSignedIn && (
              <UserButton afterSignOutUrl="/" />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-xl text-[#151816] bg-[#F5EFEB] hover:bg-[#EAE2D8] border border-[#E8DFC8] active:scale-95 transition-transform cursor-pointer">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row: Quick Tap Pills (Responsive on Desktop & Mobile) */}
        <div className="py-2.5 border-t border-[#E8DFC8]/70 flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar scroll-smooth">
          <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              onClick={() => handleNav('properties')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Home className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Vacancies</span>
            </button>

            <Link
              href="/requests"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1E3F2F] bg-[#EBF2ED] hover:bg-[#8AE0B3]/30 border border-[#8AE0B3]/50 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Wanted Board</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] animate-pulse"></span>
            </Link>

            <button 
              onClick={() => handleNav('map-explorer')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Google Map</span>
            </button>

            <button 
              onClick={() => handleNav('verification-process')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Verification</span>
            </button>

            <button 
              onClick={() => handleNav('savings-calculator')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Calculator className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Fee Calculator</span>
            </button>

            <button 
              onClick={() => handleNav('about')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Info className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>About RentBridge</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FBF9F5] border-t border-[#E8DFC8] px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {isSignedIn && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#2D5A43] bg-[#EBF2ED] flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>My Management Dashboard</span>
            </Link>
          )}
          <button 
            onClick={() => { handleNav('properties'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center gap-2.5 cursor-pointer">
            <Home className="w-4 h-4 text-[#2D5A43]" />
            <span>Browse All Vacancies</span>
          </button>
          <Link
            href="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#2D5A43] bg-[#EBF2ED] flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#2D5A43]" />
              <span>Wanted Seeker Matchboard</span>
            </span>
            <span className="text-[10px] font-extrabold bg-[#2D5A43] text-white px-2 py-0.5 rounded-full">Live Requests</span>
          </Link>
          <a
            href={WHATSAPP_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#1E3F2F] bg-[#E8F8EE] border border-[#8AE0B3]/40 flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2.5">
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              <span>WhatsApp</span>
            </span>
            <span className="text-[10px] font-extrabold bg-[#25D366] text-white px-2 py-0.5 rounded-full">Active 24/7</span>
          </a>
          <button 
            onClick={() => { handleNav('map-explorer'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#2D5A43]" />
              <span>Interactive Google Map</span>
            </span>
            <span className="text-[10px] font-extrabold bg-[#2D5A43] text-white px-2 py-0.5 rounded-full">4 Cities</span>
          </button>
          <button 
            onClick={() => { handleNav('verification-process'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
              <span>Verification & Anti-Fraud Process</span>
            </span>
          </button>
          <button 
            onClick={() => { handleNav('savings-calculator'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center gap-2.5 cursor-pointer">
            <Calculator className="w-4 h-4 text-[#2D5A43]" />
            <span>Agent Fee Savings Calculator</span>
          </button>
          <button 
            onClick={() => { handleNav('about'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center gap-2.5 cursor-pointer">
            <Info className="w-4 h-4 text-[#2D5A43]" />
            <span>About RentBridge</span>
          </button>
          <div className="pt-2">
            <button
              onClick={() => { 
                setMobileMenuOpen(false);
                if (onOpenListModal) {
                  onOpenListModal();
                } else if (isSignedIn) {
                  router.push('/dashboard/properties/new');
                } else {
                  router.push('/get-started?intent=list');
                }
              }}
              className="w-full py-3.5 rounded-xl text-center text-sm font-bold bg-[#2D5A43] text-[#FBF9F5] shadow-md flex items-center justify-center gap-2 cursor-pointer">
              <PlusCircle className="w-4 h-4" />
              <span>List Property (Landlord / Custodian)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
