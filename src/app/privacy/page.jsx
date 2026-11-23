'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  KeyRound, 
  Scale, 
  ArrowLeft, 
  Mail, 
  Clock, 
  Calendar,
  MessageCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('tldr');

  const sections = [
    { id: 'tldr', label: 'Summary & Core Protections' },
    { id: 'statutory-scope', label: '1. Statutory Scope & NDPA 2023' },
    { id: 'information-collected', label: '2. Information We Collect' },
    { id: 'how-we-use-data', label: '3. How We Use Data' },
    { id: 'anti-agent-shield', label: '4. The Anti-Agent Privacy Shield' },
    { id: 'title-vault-security', label: '5. Legal Title & KYC Document Vault' },
    { id: 'messaging-ai', label: '6. WhatsApp & AI Concierge Processing' },
    { id: 'retention-cleanup', label: '7. Data Retention & 30-Day Auto-Prune' },
    { id: 'data-subject-rights', label: '8. Your Statutory Rights (NDPA/NDPR)' },
    { id: 'cookies-sessions', label: '9. Cookies & Session Storage' },
    { id: 'contact-dpo', label: '10. Contact Our Privacy Team' },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#151816]">
      {/* Top Navigation */}
      <Navbar onOpenListModal={() => {}} onNavigateToSection={() => {}} />

      {/* Hero Banner */}
      <section className="bg-[#151816] text-white py-12 sm:py-16 relative overflow-hidden border-b border-[#252926]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5A43]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8AE0B3]">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <span className="text-white/30">•</span>
            <span>Legal Trust & Transparency</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3F2F] border border-[#2D5A43] text-xs font-bold text-[#8AE0B3] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#8AE0B3]" />
            <span>Nigeria Data Protection Act (NDPA) 2023 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Data Privacy & Anti-Agent Shield Policy
          </h1>

          <p className="text-sm sm:text-base text-[#D4CEC3] leading-relaxed max-w-3xl">
            RentBridge is engineered from the ground up to eliminate middleman extortion and data harvesting. This document outlines how we protect tenant identities, encrypt landlord title deeds, secure WhatsApp communications, and guarantee zero lead sales to roadside brokers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#8F8372]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8AE0B3]" />
              <span>Effective Date: November 2026</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#8AE0B3]" />
              <span>Jurisdiction: Federal Republic of Nigeria (Lagos, Abuja, PH, Enugu)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="lg:col-span-4 sticky top-24 hidden lg:block bg-white rounded-3xl border border-[#E8DFC8] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFC8] text-xs font-bold uppercase tracking-wider text-[#151816]">
              <FileText className="w-4 h-4 text-[#2D5A43]" />
              <span>Table of Contents</span>
            </div>
            <nav className="space-y-1 text-xs">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    activeSection === sec.id
                      ? 'bg-[#EBF2ED] text-[#2D5A43] font-bold border border-[#2D5A43]/20 shadow-2xs'
                      : 'text-[#4B524D] hover:bg-[#F5EFEB] hover:text-[#151816]'
                  }`}>
                  <span className="truncate">{sec.label}</span>
                  <ChevronRight className="w-3 h-3 shrink-0 opacity-60" />
                </button>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#E8DFC8] text-[11px] text-[#8F8372] space-y-1">
              <p>Need urgent legal assistance?</p>
              <a
                href="mailto:support@rentbridge.ng"
                className="font-bold text-[#2D5A43] hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>support@rentbridge.ng</span>
              </a>
            </div>
          </aside>

          {/* Right Column: Comprehensive Policy Text */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 4 Visual TL;DR Cards */}
            <section id="tldr" className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#151816] tracking-tight">
                Plain-English Summary (Core Protections)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#151816]">100% Anti-Agent Masking</h3>
                  <p className="text-xs text-[#4B524D] leading-relaxed">
                    Your phone number and email are never publicly exposed or sold. Roadside brokers cannot scrape your contact from our platform or Reverse Matchboard.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#151816]">Encrypted Title Deed Vault</h3>
                  <p className="text-xs text-[#4B524D] leading-relaxed">
                    Certificates of Occupancy (C of O), Deeds of Assignment, and Bar certificates are restricted to accredited human compliance officers under Row-Level Security.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#151816]">₦0 Inspection Fee Guarantee</h3>
                  <p className="text-xs text-[#4B524D] leading-relaxed">
                    Physical viewings are strictly free. Any lister soliciting transport or registration fees is immediately investigated and blacklisted nationwide.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFEB] text-[#1E3F2F] flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#151816]">WhatsApp & Bot Transparency</h3>
                  <p className="text-xs text-[#4B524D] leading-relaxed">
                    Chat interactions with Ada and automated gate pass dispatches are processed solely to facilitate viewings. We never broadcast spam or telemarketing campaigns.
                  </p>
                </div>

              </div>
            </section>

            {/* Section 1: Statutory Scope */}
            <section id="statutory-scope" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                1. Statutory Scope & Legal Framework
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                <p>
                  RentBridge Nigeria Ltd. (&ldquo;RentBridge&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to honoring and maintaining the highest standard of personal data privacy. We operate in full compliance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and the <strong>Nigeria Data Protection Regulation (NDPR)</strong>, under the regulatory authority of the Nigeria Data Protection Commission (NDPC).
                </p>
                <p>
                  For international users, including Nigerian expatriates and diaspora members renting or leasing property from the United Kingdom, North America, or Europe, we align our baseline technical protections with globally recognized principles of data minimization, lawful processing, and purpose limitation.
                </p>
              </div>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="information-collected" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-4 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                2. Information We Collect
              </h2>
              <p className="text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                We collect personal information strictly necessary to facilitate verified direct tenancy handshakes and prevent real estate fraud:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
                  <h3 className="font-bold text-[#151816] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#2D5A43]" />
                    <span>For Prospective Tenants:</span>
                  </h3>
                  <p className="text-[#4B524D]">
                    Full Name, Nigerian telephone number, email address, housing requirements (preferred city, neighborhood, budget range), preferred inspection slots, and personal profile photos (used exclusively to confirm identity at gated compound entrances).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
                  <h3 className="font-bold text-[#151816] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#2D5A43]" />
                    <span>For Landlords & Resident Caretakers:</span>
                  </h3>
                  <p className="text-[#4B524D]">
                    Full legal identity, telephone number, email address, physical property addresses across Lagos, Abuja, Port Harcourt, and Enugu, property photographs meeting access road quotas (minimum 12–17 photos), Landlord Authorization letters, and utility bills verifying occupancy.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8] space-y-1">
                  <h3 className="font-bold text-[#151816] flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#2D5A43]" />
                    <span>For Retained Legal Counsel / Solicitors:</span>
                  </h3>
                  <p className="text-[#4B524D]">
                    Supreme Court Roll Enrollment Number, Nigerian Bar Association (NBA) Bar Practicing details, Corporate Affairs Commission (CAC) firm registration, and registered Power of Attorney from estate beneficiaries.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: How We Use Data */}
            <section id="how-we-use-data" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                3. How We Use Your Data
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-[#4B524D] list-disc pl-5 leading-relaxed">
                <li><strong>Generating Gate Passes:</strong> Generating unique 6-digit compound gate passes and Ingestion Reference IDs (e.g. <code>RB-INSP-XXXXX</code>) for physical viewings.</li>
                <li><strong>WhatsApp Viewing Coordination:</strong> Dispatching automated inspection confirmations and slot proposals via WhatsApp without exposing your number to unauthorized third parties.</li>
                <li><strong>Phase 1 Title Audits:</strong> Conducting human compliance checks against state land registries (Lagos Lands Bureau, Abuja AGIS/FCDA, Rivers and Enugu Ministries of Lands).</li>
                <li><strong>Anti-Extortion Enforcement:</strong> Investigating reported demands for viewing fees, illegal registration charges, or agent markups.</li>
                <li><strong>Zero-Agent Network Purity:</strong> Monitoring accounts to prevent rogue middlemen, fake solicitations, and duplicate ghost listings.</li>
              </ul>
            </section>

            {/* Section 4: The Anti-Agent Shield */}
            <section id="anti-agent-shield" className="bg-[#1E3F2F] text-white p-6 sm:p-8 rounded-3xl space-y-3 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AE0B3]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#8AE0B3] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Anti-Agent Privacy Guarantee</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  4. The Anti-Agent Privacy Shield & Masking Protocol
                </h2>
                <div className="space-y-2 text-xs sm:text-sm text-[#E2D7C8] leading-relaxed">
                  <p>
                    Unlike traditional classified ad sites, RentBridge operates on an absolute <strong>Zero-Broker Monetization Principle</strong>:
                  </p>
                  <p className="font-bold text-white">
                    We do NOT sell, lease, rent, trade, or relay your personal phone numbers, email addresses, or tenancy requirements to any third-party real estate broker syndicates, call centers, or telemarketing agents.
                  </p>
                  <p>
                    When you post on the Wanted Seeker Matchboard, your phone number and email are <strong>100% masked</strong>. Only after a verified landlord or legal solicitor submits an authenticated property proposal that you explicitly confirm is your contact revealed to coordinate the physical walkthrough.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Title Vault Security */}
            <section id="title-vault-security" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                5. Legal Title & KYC Document Vault
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                <p>
                  We understand the extreme sensitivity of land ownership papers in Nigeria. Land title documents—including Certificates of Occupancy (C of O), Governor&apos;s Consent, and Deeds of Assignment—are stored in isolated database partitions protected by <strong>Row-Level Security (RLS)</strong>.
                </p>
                <p>
                  Title documents are accessible strictly by authorized human compliance officers during Phase 1 verification. They are <strong>never indexed by search engines, never displayed to public visitors, and never shared with other listers or competitors</strong>.
                </p>
              </div>
            </section>

            {/* Section 6: WhatsApp & AI Concierge */}
            <section id="messaging-ai" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                6. WhatsApp & AI Concierge (Ada) Processing
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                <p>
                  Our AI Concierge (Ada) provides 24/7 conversational guidance via web chat and our official WhatsApp webhook. When interacting with Ada:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>Your incoming WhatsApp sender ID (e.g. <code>+234XXXXXXXXXX</code>) is used solely to maintain session state and dispatch gate pass vouchers.</li>
                  <li>Prompts are processed in real-time through secure webhook workflows (n8n & Next.js backend proxies) to match you with verified listings.</li>
                  <li>We do not record private phone calls or access your personal WhatsApp contacts, status updates, or private personal chats.</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Data Retention & Cleanup */}
            <section id="retention-cleanup" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                7. Data Retention & 30-Day Automated Pruning
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                <p>
                  We retain personal data only for as long as necessary to provide verified tenancy transactions, maintain audit logs, and comply with state legal requirements:
                </p>
                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D97706]" />
                    <span>30-Day Stale Draft Deletion Engine</span>
                  </p>
                  <p>
                    Property listings saved as incomplete drafts with missing photo quotas are automatically deleted 30 days after creation. This ensures incomplete personal details or unfinished property images are not retained indefinitely.
                  </p>
                </div>
                <p className="text-xs">
                  Confirmed inspection appointment logs and issued Gate Passes are retained for 12 months for dispute resolution and anti-extortion audit trails.
                </p>
              </div>
            </section>

            {/* Section 8: Your Statutory Rights */}
            <section id="data-subject-rights" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                8. Your Statutory Rights under NDPA 2023 & NDPR
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                <p>
                  Under the Nigeria Data Protection Act 2023, you are endowed with enforceable rights regarding your personal information:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8]">
                    <strong className="text-[#151816] block mb-0.5">• Right to Access:</strong>
                    <span>Request an electronic copy of all personal listings, booking tickets, and profile records stored on RentBridge.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8]">
                    <strong className="text-[#151816] block mb-0.5">• Right to Rectification:</strong>
                    <span>Correct or update inaccurate contact phone numbers, legal title details, or property descriptions at any time.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8]">
                    <strong className="text-[#151816] block mb-0.5">• Right to Erasure:</strong>
                    <span>Request the permanent deletion of your user account, staged drafts, and personal contact info (&ldquo;Right to be Forgotten&rdquo;).</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8]">
                    <strong className="text-[#151816] block mb-0.5">• Right to Object:</strong>
                    <span>Object to the processing of your data or opt out of notification reminders at any moment.</span>
                  </div>
                </div>
                <p className="text-xs pt-1">
                  To exercise any of these rights, email our team directly at <a href="mailto:support@rentbridge.ng" className="text-[#2D5A43] font-bold hover:underline">support@rentbridge.ng</a>. Requests are processed within 72 hours.
                </p>
              </div>
            </section>

            {/* Section 9: Cookies & Sessions */}
            <section id="cookies-sessions" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] space-y-3 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-[#151816]">
                9. Cookies & Client-Side Session Storage
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#4B524D] leading-relaxed">
                <p>
                  RentBridge utilizes strictly essential and functional session tokens:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Authentication Cookies:</strong> Managed via Clerk to keep you securely signed in to your Tenant or Landlord dashboard.</li>
                  <li><strong>Role Preference Cookies:</strong> E.g., <code>rentbridge_intended_role</code> to remember your selected persona during onboarding.</li>
                  <li><strong>Zero Third-Party Advertising Trackers:</strong> We do not load intrusive ad-tech tracking pixels, third-party data broker scripts, or behavior profiling cookies.</li>
                </ul>
              </div>
            </section>

            {/* Section 10: Contact DPO */}
            <section id="contact-dpo" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E3F2F] to-[#151816] text-white space-y-4 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8AE0B3]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    10. Contact Our Privacy & Compliance Desk
                  </h2>
                  <p className="text-xs text-[#E2D7C8]">Dedicated Data Protection Officer (DPO) Support</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#D4CEC3] leading-relaxed">
                If you have questions regarding this Privacy Policy, wish to file a data erasure request, or need to report suspected middleman contact scraping, reach out directly to our compliance officers:
              </p>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <strong className="text-white">Email Contact:</strong>
                  <a href="mailto:support@rentbridge.ng" className="text-[#8AE0B3] font-mono hover:underline">
                    support@rentbridge.ng
                  </a>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-medium">Placeholder Official</span>
                </div>
                <div>
                  <strong className="text-white">Operating Head Office Desks:</strong>
                  <p className="text-[#E2D7C8] mt-0.5">
                    Lekki Phase 1 • Ikoyi • Victoria Island • Ikeja GRA • Yaba, Lagos State, Nigeria
                  </p>
                </div>
                <div>
                  <strong className="text-white">Regional Compliance Hubs:</strong>
                  <p className="text-[#E2D7C8] mt-0.5">
                    Abuja FCT (Maitama) • Port Harcourt (Old GRA) • Enugu (Independence Layout)
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8F8372]">
                <span>RentBridge Nigeria Ltd. • Registered under Nigerian Tenancy & Data Privacy Laws</span>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#8AE0B3] hover:text-[#151816] text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Return to Home Marketplace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer onOpenListModal={() => {}} onNavigateToSection={() => {}} />
    </div>
  );
}
