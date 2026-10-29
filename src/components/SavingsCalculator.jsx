import React, { useState } from 'react';
import { Calculator, CheckCircle, TrendingDown, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { formatNaira, calculateTraditionalCosts } from '../utils/formatters';

export default function SavingsCalculator({ onExploreProperties }) {
  const [rentAmount, setRentAmount] = useState(4000000); // ₦4,000,000 default

  const calculations = calculateTraditionalCosts(rentAmount);

  return (
    <section id="savings-calculator" className="py-20 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] border border-[#2D5A43]/20 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Zero Agent Wahala Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151816] tracking-tight">
            How Much Do You Save Bypassing Street Agents?
          </h2>
          <p className="text-base text-[#4B524D]">
            Nigerian agents inflate your move-in cost by 20% to 30% with non-negotiable "agency fees", "legal fees", and endless inspection charges. See how RentBridge puts that money back in your pocket.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E2D7C8] shadow-xl">
          
          {/* Slider input */}
          <div className="space-y-4 pb-8 border-b border-[#E8DFC8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-[#151816]">
                Target Property Rent Value (Yearly):
              </label>
              <div className="px-4 py-2 rounded-xl bg-[#F5EFEB] border border-[#E8DFC8] text-xl font-extrabold text-[#2D5A43]">
                {formatNaira(rentAmount)}
              </div>
            </div>

            <input
              type="range"
              min="1000000"
              max="25000000"
              step="250000"
              value={rentAmount}
              onChange={(e) => setRentAmount(Number(e.target.value))}
              className="w-full h-3 bg-[#E8DFC8] rounded-lg appearance-none cursor-pointer accent-[#2D5A43]"
            />

            <div className="flex justify-between text-xs text-[#8F8372] font-semibold">
              <span>₦1,000,000</span>
              <span>₦10,000,000</span>
              <span>₦25,000,000+</span>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            
            {/* The Old Street Agent Way */}
            <div className="p-6 rounded-2xl bg-[#FFF9F9] border border-[#F2D6D6] space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> The Traditional Street Agent
                </span>
                <span className="text-[11px] font-bold text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded">High Overhead</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#4B524D]">
                  <span>Base Property Rent:</span>
                  <span className="font-semibold text-[#151816]">{formatNaira(rentAmount)}</span>
                </div>
                <div className="flex justify-between text-[#B91C1C]">
                  <span>10% Agent Commission:</span>
                  <span className="font-bold">+{formatNaira(calculations.traditionalAgencyFee)}</span>
                </div>
                <div className="flex justify-between text-[#B91C1C]">
                  <span>10% Agreement / Legal Fee:</span>
                  <span className="font-bold">+{formatNaira(calculations.traditionalLegalFee)}</span>
                </div>
                <div className="flex justify-between text-[#B91C1C]">
                  <span>4x Physical Inspection Fees (₦5k each):</span>
                  <span className="font-bold">+{formatNaira(calculations.traditionalInspectionFees)}</span>
                </div>
              </div>

              <div className="border-t border-[#F2D6D6] pt-4">
                <p className="text-xs text-[#8F8372] uppercase font-bold">Total Move-In Cash Required:</p>
                <p className="text-2xl font-black text-[#B91C1C] mt-0.5">
                  {formatNaira(rentAmount + calculations.traditionalTotalOverhead)}
                </p>
                <p className="text-xs text-[#B91C1C] mt-1">
                  You burn {formatNaira(calculations.traditionalTotalOverhead)} on middlemen.
                </p>
              </div>
            </div>

            {/* The RentBridge Direct Way */}
            <div className="p-6 rounded-2xl bg-[#F0F7F3] border border-[#8AE0B3]/60 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#2D5A43] text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-bl-xl">
                Direct Deal
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E3F2F] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#2D5A43]" /> The RentBridge Direct Way
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#4B524D]">
                  <span>Direct Rent (Landlord/Lawyer):</span>
                  <span className="font-semibold text-[#151816]">{formatNaira(rentAmount)}</span>
                </div>
                <div className="flex justify-between text-[#2D5A43]">
                  <span>Agent Fee (Direct Lister):</span>
                  <span className="font-bold">₦0 (Eliminated)</span>
                </div>
                <div className="flex justify-between text-[#2D5A43]">
                  <span>Inspection Viewing Fees:</span>
                  <span className="font-bold">₦0 (100% Free)</span>
                </div>
                <div className="flex justify-between text-[#2D5A43]">
                  <span>Standard Tenancy Drafting:</span>
                  <span className="font-semibold text-[#1E3F2F]">Included / Direct</span>
                </div>
              </div>

              <div className="border-t border-[#8AE0B3]/50 pt-4 bg-white/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-[#4B524D] uppercase font-bold">Instant Cash Saved in Your Pocket:</p>
                    <p className="text-3xl font-black text-[#2D5A43] mt-0.5">
                      {formatNaira(calculations.totalSaved)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#2D5A43] text-white text-xs font-bold">
                      Zero Agent Wahala
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Action */}
          <div className="mt-8 pt-6 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#4B524D]">
              Ready to rent directly without paying agents for houses they don't even own?
            </p>
            <button
              onClick={onExploreProperties}
              className="px-6 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center gap-2 shadow-md">
              <span>Browse Direct Vacancies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

