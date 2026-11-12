'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Building2, 
  Share2, 
  PlusCircle, 
  Check, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

/**
 * Universal High-Converting SaaS Empty State Component
 * Prevents ugly blank tables or whitespace when database queries return 0 rows.
 * Features:
 * - Ambient icon badge with subtle glow
 * - Encouraging domain-specific copy
 * - Primary actionable button (href or onClick)
 * - Optional secondary action (e.g. 1-click copy link with feedback)
 */
export default function EmptyState({
  icon: Icon = Calendar,
  badge = 'Active Platform Ready',
  title = 'No appointments booked yet today',
  description = 'Your verified pipeline is active and awaiting incoming requests. Once tenants schedule viewings, their details and contact logs will appear here.',
  primaryAction = {
    label: 'Share Your Booking Link →',
    href: '/#properties',
  },
  secondaryAction = null,
  tip = '₦0 viewing fee guarantee active across Lagos, Abuja, Port Harcourt & Enugu.',
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.origin + '/#properties';
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={`p-8 sm:p-14 text-center bg-white rounded-3xl border border-[#E8DFC8] shadow-xs relative overflow-hidden animate-fadeIn ${className}`}>
      {/* Background aesthetic glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#2D5A43]/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8AE0B3]/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

      <div className="relative z-10 max-w-md mx-auto space-y-4">
        {/* Soft floating icon with ambient badge */}
        <div className="relative inline-block">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 flex items-center justify-center mx-auto shadow-sm transform transition-transform hover:scale-105">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#2D5A43]" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#8AE0B3] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-[#151816] font-bold">
            ✓
          </span>
        </div>

        {/* Badge */}
        {badge && (
          <div className="inline-block">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#F5EFEB] border border-[#E2D7C8] text-[#2D5A43]">
              {badge}
            </span>
          </div>
        )}

        {/* Main Encouraging Text */}
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-[#151816] tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#4B524D] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {primaryAction && primaryAction.href ? (
            <Link
              href={primaryAction.href}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span>{primaryAction.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : primaryAction && primaryAction.onClick ? (
            <button
              onClick={primaryAction.onClick}
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span>{primaryAction.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          {/* Quick 1-Click Copy Link or Custom Secondary Button */}
          {secondaryAction ? (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-[#151816] text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2">
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                type="button"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-[#151816] text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>{secondaryAction.label}</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-[#4B524D] hover:text-[#151816] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>Copy Direct Hub Link</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Reassuring Footer Tip */}
        {tip && (
          <p className="text-[11px] text-[#8F8372] pt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
            <span>{tip}</span>
          </p>
        )}
      </div>
    </div>
  );
}

