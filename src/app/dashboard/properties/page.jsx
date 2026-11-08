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
  ExternalLink,
  Lock,
  ArrowLeft,
  Calendar,
  Check
} from 'lucide-react';
import { formatNaira } from '../../../utils/formatters';

export default function MyPropertiesPage() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentedSuccessMsg, setRentedSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        if (profData.profile) {
          setProfile(profData.profile);
        }

        const propRes = await fetch('/api/properties?filter=my_listings');
        const propData = await propRes.json();
        if (propData.properties) {
          setProperties(propData.properties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isTenant = profile?.role === 'tenant';

  // Calculate 30-day draft expiration countdown
  const calculateDaysLeft = (createdAt) => {
    const created = new Date(createdAt || Date.now());
    const expiryDate = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
    const diffTime = expiryDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Mark property as Rented
  const handleMarkAsRented = async (propertyId) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, status: 'rented' }),
      });
      if (res.ok) {
        setRentedSuccessMsg('Property successfully marked as Rented! It has been removed from the public marketplace.');
        setProperties((prev) =>
          prev.map((p) => (p.id === propertyId ? { ...p, status: 'rented' } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If Tenant account, enforce strict role isolation
  if (!loading && isTenant) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8DFC8] text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#151816]">
          Tenant Account Restrictions
        </h2>
        <p className="text-xs sm:text-sm text-[#4B524D] leading-relaxed">
          Your account is registered as a <strong>Verified Tenant</strong>. To maintain 100% zero-agent purity and multi-tenant security, only registered Landlords, Retained Lawyers, and Resident Caretakers can stage or list properties.
        </p>
        <p className="text-xs text-[#8F8372]">
          If you are also a property owner looking to list, please sign in with your separate custodian account.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold shadow-md hover:bg-[#1E3F2F] transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tenant Sanctuary</span>
          </Link>
        </div>
      </div>
    );
  }

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
            Properties & Staged Drafts
          </h1>
          <p className="text-xs sm:text-sm text-[#8F8372] mt-0.5">
            Manage your verified vacancies and continue uploading photos to your 30-day staged drafts.
          </p>
        </div>

        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto">
          <PlusCircle className="w-4 h-4" />
          <span>Stage New Listing</span>
        </Link>
      </div>

      {rentedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43]/30 text-xs font-bold text-[#2D5A43] flex items-center justify-between">
          <span>✓ {rentedSuccessMsg}</span>
          <button onClick={() => setRentedSuccessMsg('')} className="text-[#8F8372] hover:text-[#151816]">✕</button>
        </div>
      )}

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
        {filtered.map((property) => {
          const daysLeft = calculateDaysLeft(property.createdAt || property.created_at);

          return (
            <div
              key={property.id}
              className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#2D5A43]/40 transition-all">
              <div>
                {/* Image & Status Badge */}
                <div className="relative h-48 w-full bg-[#151816]">
                  <img
                    src={property.image || '/images/hero-lagos-duplex.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    {property.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2D5A43] text-xs font-extrabold shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{property.verificationBadge || property.verification_badge || '100% Verified'}</span>
                      </span>
                    ) : property.status === 'rented' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-extrabold shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>Rented Out</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-extrabold shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Draft • Expires in {daysLeft}d</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-bold">
                    {property.photoCount || property.photo_count || 0} / {property.minRequiredPhotos || property.min_required_photos || 12} Photos
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
                        {formatNaira(property.annualRent || property.annual_rent || 0)}
                        <span className="text-xs font-normal text-[#4B524D] ml-0.5">/ yr</span>
                      </span>
                    </div>

                    <span className="text-xs text-[#8F8372] font-semibold">
                      0% Agent Fee
                    </span>
                  </div>

                  {/* 30-Day Draft Lifespan Notice */}
                  {property.status === 'draft' && (
                    <div className="p-3 rounded-xl bg-[#FEF3C7]/60 border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
                      <p className="font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Photo Quota Incomplete</span>
                        </span>
                        <span className="text-[10px] bg-[#D97706] text-white px-2 py-0.5 rounded-full">
                          {daysLeft} days left
                        </span>
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        {property.notes || 'Upload the remaining photos of access road, compound gate, and interior to submit for Phase 1 verification.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-4 bg-[#F5EFEB]/60 border-t border-[#E8DFC8] flex items-center justify-between gap-2">
                {property.status === 'draft' ? (
                  <Link
                    href="/dashboard/properties/new"
                    className="flex-1 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Resume Draft & Upload Photos</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <Link
                      href={`/?highlight=${property.id}`}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-[#1E3F2F] text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs">
                      <Eye className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>View Live Page</span>
                    </Link>

                    {property.status === 'active' && (
                      <button
                        onClick={() => handleMarkAsRented(property.id)}
                        className="py-2.5 px-3 rounded-xl bg-[#151816] hover:bg-black text-white text-xs font-bold cursor-pointer transition-all">
                        Mark as Rented
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
