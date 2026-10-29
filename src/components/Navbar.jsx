import React, { useState } from 'react';
import { ShieldCheck, MapPin, Building2, PlusCircle, Menu, X, ArrowRight, Calculator, Home, Info } from 'lucide-react';

export default function Navbar({ onOpenListModal, onNavigateToSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/98 backdrop-blur-md border-b border-[#E8DFC8] shadow-xs">
      {/* Top Header Row: Logo & Action CTAs */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" 
            onClick={() => onNavigateToSection('hero')}>
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
          </div>

          {/* Action CTAs (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenListModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#1E3F2F] border border-[#D7CBBB] transition-all shadow-sm cursor-pointer">
              <PlusCircle className="w-4 h-4 text-[#2D5A43]" />
              <span>List Property</span>
              <span className="text-[10px] bg-[#2D5A43]/10 text-[#2D5A43] px-1.5 py-0.5 rounded font-bold">Landlords & Reps</span>
            </button>

            <button
              onClick={() => onNavigateToSection('properties')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#2D5A43] hover:bg-[#1E3F2F] text-[#FBF9F5] transition-all shadow-md shadow-[#2D5A43]/25 cursor-pointer">
              <span>Find Rent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action CTAs (Mobile) */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={onOpenListModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2D5A43] text-white shadow-sm flex items-center gap-1 active:scale-95 transition-transform">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-xl text-[#151816] bg-[#F5EFEB] hover:bg-[#EAE2D8] border border-[#E8DFC8] active:scale-95 transition-transform">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row: Quick Tap Pills (Responsive on Desktop & Mobile) */}
        <div className="py-2.5 border-t border-[#E8DFC8]/70 flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar scroll-smooth">
          <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              onClick={() => onNavigateToSection('properties')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Home className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Vacancies</span>
            </button>

            <button 
              onClick={() => onNavigateToSection('map-explorer')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Google Map</span>
            </button>

            <button 
              onClick={() => onNavigateToSection('verification-process')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Verification</span>
            </button>

            <button 
              onClick={() => onNavigateToSection('savings-calculator')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Calculator className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Fee Calculator</span>
            </button>

            <button 
              onClick={() => onNavigateToSection('about')} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#151816] bg-[#F5EFEB] hover:bg-white hover:text-[#2D5A43] active:bg-[#2D5A43] active:text-white border border-[#E8DFC8] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer">
              <Info className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>About RentBridge</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FBF9F5] border-t border-[#E8DFC8] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <button 
            onClick={() => { onNavigateToSection('properties'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center gap-2.5">
            <Home className="w-4 h-4 text-[#2D5A43]" />
            <span>Browse All Vacancies</span>
          </button>
          <button 
            onClick={() => { onNavigateToSection('map-explorer'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#2D5A43]" />
              <span>Interactive Google Map</span>
            </span>
            <span className="text-[10px] font-extrabold bg-[#2D5A43] text-white px-2 py-0.5 rounded-full">4 Cities</span>
          </button>
          <button 
            onClick={() => { onNavigateToSection('verification-process'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
              <span>Verification & Anti-Fraud Process</span>
            </span>
          </button>
          <button 
            onClick={() => { onNavigateToSection('savings-calculator'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center gap-2.5">
            <Calculator className="w-4 h-4 text-[#2D5A43]" />
            <span>Agent Fee Savings Calculator</span>
          </button>
          <button 
            onClick={() => { onNavigateToSection('about'); setMobileMenuOpen(false); }}
            className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-[#151816] hover:bg-[#F5EFEB] flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#2D5A43]" />
            <span>About RentBridge</span>
          </button>
          <div className="pt-2">
            <button
              onClick={() => { onOpenListModal(); setMobileMenuOpen(false); }}
              className="w-full py-3.5 rounded-xl text-center text-sm font-bold bg-[#2D5A43] text-[#FBF9F5] shadow-md flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>List Property (Landlord / Custodian)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
