import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigateToSection, onOpenListModal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#151816] text-[#FBF9F5] border-t border-[#252926]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13V11C3 7.68629 5.68629 5 9 5H15C18.3137 5 21 7.68629 21 11V13M3 13H21M3 13V19M21 13V19M8 13V19M16 13V19" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">Rent<span className="text-[#8AE0B3]">Bridge</span></span>
            </div>

            <p className="text-xs text-[#E2D7C8] leading-relaxed max-w-sm">
              "Bridging the gap between landlords and tenants."
              Nigeria's direct real estate platform eliminating street agents, 10% agency cuts, and fake inspection fees.
            </p>

            <div className="p-3.5 rounded-xl bg-[#1E3F2F]/60 border border-[#2D5A43] text-xs text-[#8AE0B3] space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-4 h-4 text-[#8AE0B3]" /> ₦0 Inspection Fee Policy
              </p>
              <p className="text-[11px] text-[#E2D7C8]">
                Report any user requesting viewing fees for immediate blacklisting across all covered regions.
              </p>
            </div>
          </div>

          {/* Supported Cities */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372]">Covered Nigerian Hubs</h4>
            <ul className="space-y-2 text-xs text-[#E2D7C8]">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8AE0B3]" />
                <strong>Lagos:</strong> Lekki, Ikeja, Yaba, Ikoyi, Victoria Island
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8AE0B3]" />
                <strong>Abuja FCT:</strong> Maitama, Wuse 2, Gwarinpa, CBD
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8AE0B3]" />
                <strong>Port Harcourt:</strong> Old GRA, Trans-Amadi, Peter Odili
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8AE0B3]" />
                <strong>Enugu:</strong> Independence Layout, New Haven, GRA
              </li>
            </ul>
          </div>

          {/* Quick Links & Lister Direct */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8372]">Direct Property Links</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#E2D7C8]">
              <button 
                onClick={() => onNavigateToSection('properties')} 
                className="text-left hover:text-white transition-colors">
                • Residential Flats
              </button>
              <button 
                onClick={() => onNavigateToSection('properties')} 
                className="text-left hover:text-white transition-colors">
                • Commercial Shops
              </button>
              <button 
                onClick={() => onNavigateToSection('properties')} 
                className="text-left hover:text-white transition-colors">
                • Logistics Warehouses
              </button>
              <button 
                onClick={() => onNavigateToSection('map-explorer')} 
                className="text-left hover:text-white transition-colors">
                • Google Map Exploration
              </button>
              <button 
                onClick={() => onNavigateToSection('verification-process')} 
                className="text-left hover:text-white transition-colors">
                • Anti-Fraud Framework
              </button>
              <button 
                onClick={() => onNavigateToSection('savings-calculator')} 
                className="text-left hover:text-white transition-colors">
                • Agent Fee Calculator
              </button>
              <button 
                onClick={() => onNavigateToSection('about')} 
                className="text-left hover:text-white transition-colors text-[#8AE0B3] font-semibold">
                • About RentBridge & Mission
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenListModal}
                className="w-full py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold transition-all shadow-md">
                List Vacancy (Landlord / Lawyer Portal)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-8 border-t border-[#252926] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F8372]">
          <div>
            <p>© {new Date().getFullYear()} RentBridge Nigeria Ltd. All Rights Reserved.</p>
            <p className="text-[11px] text-[#A69B8D] mt-0.5">
              Headquarters / Operating Desks: Lekki Phase 1 • Ikoyi • Victoria Island • Ikeja GRA • Yaba
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">Payment Terms: Annual Rent Only</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#252926] hover:bg-[#2D5A43] text-white transition-colors cursor-pointer">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

