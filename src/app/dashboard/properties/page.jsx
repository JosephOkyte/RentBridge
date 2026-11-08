'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  PlusCircle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Eye, 
  Edit3, 
  Camera, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { formatNaira } from '../../../utils/formatters';
import { IMAGES } from '../../../utils/images';

export default function MyPropertiesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties?filter=my_listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.properties) {
          setProperties(data.properties);
        }
      })
      .catch((err) => console.error('Error fetching properties:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'drafts') return p.status === 'draft';
    if (activeTab === 'pending') return p.status === 'pending_audit';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
            My Listed Properties & Drafts
          </h1>
          <p className="text-xs sm:text-sm text-[#8F8372] mt-0.5">
            Strict multi-tenant security: Only you can view or manage your properties and drafts.
          </p>
        </div>

        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto">
          <PlusCircle className="w-4 h-4" />
          <span>Add / Draft Property</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DFC8] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#2D5A43] text-white shadow-xs'
              : 'bg-white text-[#4B524D] hover:bg-[#F5EFEB] border border-[#E8DFC8]'
          }`}>
          All Listings ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-[#2D5A43] text-white shadow-xs'
              : 'bg-white text-[#4B524D] hover:bg-[#F5EFEB] border border-[#E8DFC8]'
          }`}>
          Active & Verified ({properties.filter((p) => p.status === 'active').length})
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'drafts'
              ? 'bg-[#2D5A43] text-white shadow-xs'
              : 'bg-white text-[#4B524D] hover:bg-[#F5EFEB] border border-[#E8DFC8]'
          }`}>
          Saved Drafts ({properties.filter((p) => p.status === 'draft').length})
        </button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              {/* Image & Status Badge */}
              <div className="relative h-48 w-full bg-[#151816]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3">
                  {property.status === 'active' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2D5A43] text-xs font-extrabold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{property.verificationBadge || '100% Verified'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-extrabold shadow-sm">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Saved Draft (Hidden)</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-bold">
                  {property.photoCount} / {property.minRequiredPhotos} Photos
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#8F8372]">
                  <MapPin className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>{property.neighborhood}, {property.city}</span>
                </div>

                <h3 className="text-base font-extrabold text-[#151816] leading-snug">
                  {property.title}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-[#8F8372] uppercase font-bold block">Annual Direct Rent</span>
                    <span className="text-lg font-black text-[#2D5A43]">
                      {formatNaira(property.annualRent)}
                      <span className="text-xs font-normal text-[#4B524D] ml-0.5">/ yr</span>
                    </span>
                  </div>

                  <span className="text-xs text-[#8F8372] font-semibold">
                    0% Agent Fee
                  </span>
                </div>

                {/* Draft Photo Quota Warning */}
                {property.status === 'draft' && (
                  <div className="p-3 rounded-xl bg-[#FEF3C7]/60 border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Photo Quota Incomplete</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {property.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="p-4 bg-[#F5EFEB]/60 border-t border-[#E8DFC8] flex items-center justify-between gap-2">
              {property.status === 'draft' ? (
                <>
                  <Link
                    href="/dashboard/properties/new"
                    className="flex-1 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Resume & Upload Photos</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`/?highlight=${property.id}`}
                    target="_blank"
                    className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-[#1E3F2F] text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs">
                    <Eye className="w-3.5 h-3.5 text-[#2D5A43]" />
                    <span>View Live Marketplace Page</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

