'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HeartHandshake, 
  Eye, 
  Award,
  TrendingDown,
  Clock,
  Quote,
  Check
} from 'lucide-react';

export default function AboutSection({ onExploreVacancies }) {
  const hubs = [
    { name: 'Lekki Phase 1', area: 'Admiralty Way Axis, Lagos', desc: 'Residential & Luxury Estates Desk' },
    { name: 'Ikoyi', area: 'Bourdillon & Kingsway Corridor, Lagos', desc: 'Diplomatic & Waterfront Portfolio' },
    { name: 'Victoria Island', area: 'Ahmadu Bello & Ozumba Mbadiwe, Lagos', desc: 'Commercial & Corporate Suites' },
    { name: 'Ikeja', area: 'Ikeja GRA & Oba Akran Industrial, Lagos', desc: 'Mainland Commercial & Logistics' },
    { name: 'Yaba', area: 'Commercial Avenue & Herbert Macaulay, Lagos', desc: 'Tech Hubs & Creative Spaces' },
  ];

  const caseStudies = [
    {
      name: 'Engr. Babatunde Balogun',
      role: 'Verified Property Owner (Landlord)',
      location: 'Admiralty Way, Lekki Phase 1',
      saved: '₦1,400,000 saved in agency cuts',
      quote: 'Listed my 4-bedroom semi-detached duplex directly. Within 48 hours, RentBridge audited my registered Deed of Assignment and published it live. I closed a deal with a vetted corporate tenant and kept 100% of my ₦14,000,000 rent without surrendering a 10% cut to roadside brokers.',
      verifiedDeed: 'C of O / Deed Audited'
    },
    {
      name: 'Dr. Amarachi Okonkwo',
      role: 'Verified Renter (Tenant)',
      location: 'Wuse 2 Commercial Axis, Abuja',
      saved: '₦45,000 saved on inspection fees',
      quote: 'After wasting ₦45,000 on roadside agents demanding registration fees and fuel money for locked houses, RentBridge was a breath of fresh air. I picked an inspection date, received my official 6-digit compound gate pass instantly via WhatsApp, and viewed the apartment for strictly ₦0.',
      verifiedDeed: '₦0 Inspection Guarantee'
    },
    {
      name: 'Barr. Chinedu Eze',
      role: 'Retained Estate Legal Counsel',
      location: 'Old GRA, Port Harcourt',
      saved: 'Zero broker markup disputes',
      quote: 'Managing family estate properties was a nightmare with freelance agents inflating annual rent by 15% behind our backs. On RentBridge, my Supreme Court enrollment number was verified in one afternoon. Our lease terms remain 100% transparent and legally protected.',
      verifiedDeed: 'Supreme Court Roll Verified'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white border-t border-[#E8DFC8] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D5A43]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E2D7C8]/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>About RentBridge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#151816] tracking-tight">
            Eradicating the "Agent Pandemic" in Nigerian Real Estate
          </h2>
          <p className="text-base sm:text-lg text-[#4B524D] leading-relaxed">
            Bridging the gap between property owners and tenants with total transparency, zero middleman extortion, and authenticated peace of mind.
          </p>
        </div>

        {/* The Catchy Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Left Column: The Manifesto / Catchy Message */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-sm sm:text-base text-[#3F4641] leading-relaxed">
              <p className="text-lg sm:text-xl font-bold text-[#151816] leading-snug">
                For decades, renting a home, retail shop, or warehouse in Nigeria has meant confronting an entrenched <span className="text-[#2D5A43]">"Agent Pandemic"</span>.
              </p>
              <p>
                Prospective tenants were forced to pay illegal ₦5,000–₦10,000 "registration" and inspection transport fees just to view substandard apartments. When an agreement was reached, rogue street brokers slapped on exorbitant 10% agency fees, 10% legal agreement fees, and endless unverified markups—pocketing hundreds of thousands of Naira for spaces they didn’t own or manage.
              </p>
              <p>
                <strong>RentBridge was born to smash this broken status quo.</strong> We built an institutional digital bridge connecting vetted tenants directly with authentic Landlords, resident Caretakers, and retained Legal Custodians. By verifying land titles against state deed registries and enforcing zero viewing charges, we restore dignity, honesty, and financial sanity to Nigerian leasing.
              </p>
            </div>

            {/* Core Values 3-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
                <ShieldCheck className="w-6 h-6 text-[#2D5A43]" />
                <h4 className="font-extrabold text-sm text-[#151816]">Zero Street Agents</h4>
                <p className="text-xs text-[#8F8372]">Direct custody holders only. No relay brokers.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
                <CheckCircle2 className="w-6 h-6 text-[#2D5A43]" />
                <h4 className="font-extrabold text-sm text-[#151816]">₦0 Viewing Fees</h4>
                <p className="text-xs text-[#8F8372]">100% free physical inspection guaranteed.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
                <Award className="w-6 h-6 text-[#2D5A43]" />
                <h4 className="font-extrabold text-sm text-[#151816]">Verified Deeds</h4>
                <p className="text-xs text-[#8F8372]">C of O & title audits across all listings.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Brand Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#1E3F2F] text-white p-7 sm:p-9 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#8AE0B3]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8AE0B3]">Corporate Identity</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  RentBridge Nigeria Ltd.
                </h3>
                <p className="text-xs text-[#E2D7C8] mt-1 font-medium italic">
                  "Bridging the gap between landlords and tenants"
                </p>
              </div>

              <div className="border-t border-[#2D5A43] pt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8AE0B3]">Business Model:</span>
                  <span className="font-bold text-white">Direct Landlord-to-Tenant Marketplace</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8AE0B3]">Rent Schedule:</span>
                  <span className="font-bold text-white">Strictly Annual (Yearly)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8AE0B3]">Agency Commission:</span>
                  <span className="font-bold text-[#8AE0B3]">0% (Completely Eliminated)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8AE0B3]">Inspection Policy:</span>
                  <span className="font-bold text-[#8AE0B3]">₦0 Free Viewings</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-[#E2D7C8] space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#8AE0B3]" /> The RentBridge Pledge
                </p>
                <p className="text-[11px] leading-relaxed">
                  We pledge that no user will ever pay a middleman cut or be extorted to see an apartment on this platform.
                </p>
              </div>

              <button
                onClick={onExploreVacancies}
                className="w-full py-3.5 rounded-xl bg-[#8AE0B3] hover:bg-[#A3E8C4] text-[#151816] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer">
                <span>Browse Authenticated Vacancies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Grounded SaaS Operational Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8372] block">Extortion Fees Blocked</span>
            <div className="text-2xl sm:text-3xl font-black text-[#2D5A43]">₦184.5M+</div>
            <p className="text-xs text-[#4B524D]">In 10% agency cuts & fake viewing fees prevented across 4 hubs.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8372] block">Deed Audit SLA</span>
            <div className="text-2xl sm:text-3xl font-black text-[#151816]">48 Hours</div>
            <p className="text-xs text-[#4B524D]">Human legal & photo review turnaround before listings go live.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8372] block">Landlord Yield Retained</span>
            <div className="text-2xl sm:text-3xl font-black text-[#2D5A43]">100%</div>
            <p className="text-xs text-[#4B524D]">Property owners collect their full asking price with 0% deducted.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8372] block">Compound Viewing Policy</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0369A1]">₦0 Free</div>
            <p className="text-xs text-[#4B524D]">Instant 6-digit WhatsApp gate pass with zero upfront payment.</p>
          </div>
        </div>

        {/* Verified Case Studies & High-Trust Track Record */}
        <div className="space-y-6 mb-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5" />
              <span>Real Experiences from Verified Custodians & Tenants</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#151816]">
              Real Landlords. Real Tenants. Zero Middleman Drama.
            </h3>
            <p className="text-xs sm:text-sm text-[#4B524D]">
              Direct transactions completed without agency fee markups or locked gate extortion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2D5A43] transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20">
                      {cs.verifiedDeed}
                    </span>
                    <span className="text-xs font-black text-[#2D5A43]">{cs.saved}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3F4641] leading-relaxed italic">
                    "{cs.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DFC8]/60">
                  <h4 className="text-sm font-extrabold text-[#151816]">{cs.name}</h4>
                  <p className="text-xs font-semibold text-[#2D5A43]">{cs.role}</p>
                  <p className="text-[11px] text-[#8F8372] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#2D5A43]" />
                    <span>{cs.location}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Address & Operational Hubs Showcase */}
        <div className="bg-[#F5EFEB] p-6 sm:p-10 rounded-3xl border border-[#E2D7C8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F8372]">
                <MapPin className="w-4 h-4 text-[#2D5A43]" />
                <span>Primary Business Address & Operational Hubs</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#151816] mt-0.5">
                Headquartered in Lagos across 5 Strategic Key Hubs
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] text-[#2D5A43] self-start sm:self-auto">
              Active Regional Desks in Abuja • Port Harcourt • Enugu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {hubs.map((hub, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl border border-[#E8DFC8] space-y-1 shadow-xs hover:border-[#2D5A43] transition-colors">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#2D5A43]">
                  <Building2 className="w-4 h-4" />
                  <span>{hub.name}</span>
                </div>
                <p className="text-xs font-semibold text-[#151816]">{hub.area}</p>
                <p className="text-[11px] text-[#8F8372]">{hub.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

