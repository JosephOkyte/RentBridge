import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Scale, KeyRound, AlertTriangle, CheckCircle, FileText, Lock, Eye, Building2 } from 'lucide-react';

export default function VerificationGuide() {
  const [activeTab, setActiveTab] = useState('overview');

  const verificationTiers = [
    {
      id: 'landlord',
      title: 'Landlord',
      badgeText: 'Verified Landlord',
      badgeColor: 'bg-[#1E3F2F] text-[#8AE0B3] border-[#2D5A43]',
      icon: UserCheck,
      summary: 'For the direct legal owner of the property holding recognized land title.',
      requirements: [
        'Certificate of Occupancy (C of O), Governor\'s Consent, or registered Deed of Assignment.',
        'National Identification Number (NIN) or BVN matching the name on title documents.',
        'Recent property land use charge, tenement rate, or PHCN / disco utility bill.',
        'Live geo-tagged selfie or video verification inside the vacant property.'
      ],
      stateCompliance: 'Verified against Lagos State Lands Bureau, Abuja AGIS/FCDA, Rivers State Ministry of Lands, or Enugu Ministry of Lands.'
    },
    {
      id: 'caretaker',
      title: 'Authorized Caretaker',
      badgeText: 'Authorized Caretaker',
      badgeColor: 'bg-[#2D5A43] text-[#FBF9F5] border-[#44795C]',
      icon: KeyRound,
      summary: 'For resident managers or estate caretakers formally delegated by property owners.',
      requirements: [
        'Signed & notarized Landlord Authorization Letter or Power of Custody.',
        'Direct phone & video compliance audit with the actual property owner.',
        'Caretaker NIN, residential address, and guarantor contact details.',
        'Physical possession of property keys confirmed via video walkthrough.'
      ],
      stateCompliance: 'Strict annual renewal. Caretakers are prohibited from adding personal broker fees or charging viewing fees.'
    },
    {
      id: 'lawyer',
      title: 'Legal Custodian / Lawyer',
      badgeText: 'Accredited Legal Custodian',
      badgeColor: 'bg-[#151816] text-[#E2D7C8] border-[#3F4641]',
      icon: Scale,
      summary: 'For licensed Nigerian legal practitioners managing private or family estates.',
      requirements: [
        'Nigerian Bar Association (NBA) Bar Practicing Number verified against the Supreme Court Roll.',
        'Registered Power of Attorney or formal letter of administration/retainer from estate beneficiaries.',
        'Law firm registration with the Corporate Affairs Commission (CAC).',
        'Standardized digital lease agreement drafted in full compliance with local state tenancy laws.'
      ],
      stateCompliance: 'Recognized legal representation across all 4 key economic hubs: Lagos, Abuja FCT, Rivers, and Enugu.'
    }
  ];

  return (
    <section id="verification-process" className="py-20 bg-[#F5EFEB] border-y border-[#E2D7C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>The Trust & Safety Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151816] tracking-tight">
            How RentBridge Eliminates Fake Agents & Rental Scams in Nigeria
          </h2>
          <p className="text-base sm:text-lg text-[#4B524D]">
            In traditional Nigerian real estate, street agents create an opaque barrier of fake photos, double-rent collection, and endless inspection fees. 
            Here is our 4-point verification framework guaranteeing authenticity.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#2D5A43]/10 text-[#2D5A43] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#151816] mb-2">1. Title & Deed Audit</h3>
            <p className="text-sm text-[#4B524D] leading-relaxed">
              Every lister must prove ownership or legal custody. We cross-check C of O, Deed of Assignment, or FCDA/AGIS allocation papers before any house goes live.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#1E3F2F]/10 text-[#1E3F2F] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#151816] mb-2">2. Zero Inspection Fees</h3>
            <p className="text-sm text-[#4B524D] leading-relaxed">
              Tenants will <strong className="text-[#151816]">never pay ₦5,000 "registration" or transport fee</strong> to see a house. Any lister caught requesting inspection fees is instantly banned.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#8AE0B3]/30 text-[#1E3F2F] flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#151816] mb-2">3. Physical Key Verification</h3>
            <p className="text-sm text-[#4B524D] leading-relaxed">
              We verify that the lister physically holds keys to the vacant flat, shop, or warehouse via geo-located video checks and verified compound photos.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#2D5A43]/10 text-[#2D5A43] flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#151816] mb-2">4. Multi-State Jurisdiction</h3>
            <p className="text-sm text-[#4B524D] leading-relaxed">
              Custom-tailored verification guidelines for properties in <strong className="text-[#151816]">Lagos, Abuja, Port Harcourt,</strong> and <strong className="text-[#151816]">Enugu</strong>.
            </p>
          </div>

        </div>

        {/* Detailed Tier Explorer */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#E2D7C8] shadow-md">
          <div className="border-b border-[#E8DFC8] pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#151816]">Who Can List on RentBridge?</h3>
              <p className="text-sm text-[#4B524D]">We only permit three accredited roles. Click to examine their verification standard:</p>
            </div>
            
            {/* Tabs (Responsive on Mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F5EFEB] p-1.5 rounded-xl border border-[#E2D7C8] w-full sm:w-auto overflow-x-auto no-scrollbar">
              {verificationTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTab(tier.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer whitespace-nowrap ${
                      (activeTab === tier.id || (activeTab === 'overview' && tier.id === 'landlord'))
                        ? 'bg-[#2D5A43] text-white shadow-sm'
                        : 'text-[#3F4641] hover:text-[#151816]'
                    }`}>
                    <Icon className="w-4 h-4" />
                    <span>{tier.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content */}
          {verificationTiers.map((tier) => {
            const isSelected = activeTab === tier.id || (activeTab === 'overview' && tier.id === 'landlord');
            if (!isSelected) return null;

            const Icon = tier.icon;
            return (
              <div key={tier.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tier.badgeColor}`}>
                      {tier.badgeText}
                    </span>
                    <span className="text-xs text-[#8F8372] font-semibold">Strict KYC & Legal Review</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#151816]">
                    {tier.summary}
                  </h4>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8F8372]">Mandatory Verification Documents:</p>
                    <div className="space-y-2.5">
                      {tier.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-[#2D5A43] shrink-0 mt-0.5" />
                          <span className="text-sm text-[#252926] font-medium">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs text-[#4B524D] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
                    <span><strong>State Compliance:</strong> {tier.stateCompliance}</span>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8F8372] uppercase">Sample Listing Badge</span>
                      <span className="text-[11px] font-semibold text-[#2D5A43] bg-[#EBF2ED] px-2 py-0.5 rounded">Live Status</span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2D5A43] text-white flex items-center justify-center font-bold">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#151816]">Authenticated Lister</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${tier.badgeColor}`}>
                            {tier.badgeText}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#4B524D] border-t border-[#E8DFC8] pt-2 space-y-1">
                        <p>✓ Proof of Authority Validated</p>
                        <p>✓ Zero Middleman Commission</p>
                        <p>✓ Free Direct Inspection Guaranteed</p>
                      </div>
                    </div>

                    <div className="bg-[#1E3F2F] text-white p-3.5 rounded-xl text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-[#8AE0B3]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Anti-Agent Enforcement
                      </p>
                      <p className="text-white/80 leading-relaxed text-[11px]">
                        Any listing submitted by an unaccredited third-party street broker is automatically rejected during our 24-hour compliance audit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

