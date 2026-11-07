'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Building2, 
  Upload, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  ArrowLeft,
  BookmarkCheck,
  Scale,
  KeyRound,
  FileText
} from 'lucide-react';
import { CITIES, CATEGORIES } from '../../../../data/properties';
import { IMAGES } from '../../../../utils/images';

export default function NewPropertyWizardPage() {
  const router = useRouter();
  const { user } = useUser();

  const [listerRole, setListerRole] = useState('landlord');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    propertyKind: 'Contemporary Duplex',
    category: 'residential',
    city: 'lagos',
    neighborhood: '',
    address: '',
    annualRent: '',
    cautionDeposit: '',
    serviceCharge: '',
    idDocumentType: 'C of O / Governor Consent',
    idNumber: '',
  });

  // Staged Photos state
  const minRequiredPhotos = formData.category === 'residential' ? 12 : 17;
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const photosRemaining = Math.max(0, minRequiredPhotos - uploadedPhotos.length);
  const hasMetQuota = uploadedPhotos.length >= minRequiredPhotos;

  // Sample photo bundle generator for immediate testing
  const handleLoadSamplePhotos = () => {
    const sampleLabels = formData.category === 'residential'
      ? [
          'Street Entrance Gate & Security Post', 'Full Length of Access Road (Paved)', 'Compound Interlocked Driveway',
          'Front Facade & Private Carport', 'Main Living Room & Dining Area', 'Fitted Kitchen & Smoke Extractor',
          'Master Bedroom with Wardrobes', 'Master En-suite Bathroom', 'Second Bedroom Walkthrough',
          'Third Bedroom Walkthrough', 'Backyard & Generator / Inverter Platform', 'Borehole / Water Treatment Plant'
        ]
      : [
          'Street Frontage & Traffic View', 'Commercial Access Road & Pavement', 'Pedestrian Walkway & Street Sign',
          'Plaza Gate & Perimeter Fencing', 'Showroom Front Glass Door', 'Ground Floor Retail Hall',
          'Floor 1 Office Suites', 'Restrooms & Sanitary Facilities', 'Fire Exit & Emergency Stairwell',
          'Loading Bay / Delivery Ramp', 'Generator House & Transformer', 'Ceiling & HVAC Units',
          'Parking Lot & Customer Spaces', 'Security Control Room', 'Adjoining Commercial Premises',
          'Electrical Distribution Board', 'Water Reservoir Tanks'
        ];

    const sampleImages = [
      IMAGES.heroLekkiEntrance,
      IMAGES.heroLagosDuplex,
      IMAGES.interiorLivingRoom,
      IMAGES.heroIkoyiApartment,
      IMAGES.heroLagoonWaterfront,
      IMAGES.heroMaitamaTerrace,
      IMAGES.heroAbujaPlaza,
      IMAGES.heroPhCommercial,
      IMAGES.heroPhGraDuplex,
      IMAGES.heroEnuguMansion,
      IMAGES.commercialAbujaBoutique,
      IMAGES.industrialWarehouse
    ];

    const generatedSet = sampleLabels.map((label, idx) => ({
      id: `photo-${idx}`,
      name: label,
      url: sampleImages[idx % sampleImages.length],
      tag: label
    }));

    setUploadedPhotos(generatedSet);
    setErrorMessage('');
  };

  const handleRemovePhoto = (id) => {
    setUploadedPhotos(uploadedPhotos.filter(p => p.id !== id));
  };

  // Submit action (either as 'draft' or 'pending_audit')
  const handleAction = async (statusTarget) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (statusTarget === 'pending_audit' && !hasMetQuota) {
      setErrorMessage(
        `Verification requires at least ${minRequiredPhotos} photos (${photosRemaining} more needed) covering the street road, gate, and interior. You can click "Save as Draft" to finish later.`
      );
      return;
    }

    if (!formData.title || !formData.address || !formData.annualRent) {
      setErrorMessage('Please fill in the required property title, address, and annual rent.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: statusTarget,
          photos: uploadedPhotos,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save property');
      }

      setSuccessMessage(data.message);
      setTimeout(() => {
        router.push('/dashboard/properties');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/properties"
          className="p-2 rounded-xl bg-white border border-[#E8DFC8] text-[#4B524D] hover:bg-[#F5EFEB]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
            Add Property or Save Draft
          </h1>
          <p className="text-xs text-[#8F8372]">
            Upload full-length street views, compound gates, and transparent annual terms.
          </p>
        </div>
      </div>

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43] text-xs font-bold text-[#1E3F2F] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#2D5A43] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#EF4444] text-xs font-bold text-[#B91C1C] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Step 1: Legal Relationship */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
            1. What is your legal relationship to this property?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setListerRole('landlord')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                listerRole === 'landlord'
                  ? 'bg-[#EBF2ED] border-[#2D5A43] ring-2 ring-[#2D5A43]/20'
                  : 'bg-white border-[#E8DFC8] hover:border-[#D7CBBB]'
              }`}>
              <ShieldCheck className="w-6 h-6 text-[#2D5A43] mb-1.5" />
              <h4 className="font-extrabold text-sm text-[#151816]">Landlord</h4>
              <p className="text-xs text-[#4B524D] mt-0.5">Direct titleholder / Certificate of Occupancy holder.</p>
            </div>

            <div
              onClick={() => setListerRole('caretaker')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                listerRole === 'caretaker'
                  ? 'bg-[#EBF2ED] border-[#2D5A43] ring-2 ring-[#2D5A43]/20'
                  : 'bg-white border-[#E8DFC8] hover:border-[#D7CBBB]'
              }`}>
              <KeyRound className="w-6 h-6 text-[#2D5A43] mb-1.5" />
              <h4 className="font-extrabold text-sm text-[#151816]">Authorized Caretaker</h4>
              <p className="text-xs text-[#4B524D] mt-0.5">Resident custodian with signed owner authorization.</p>
            </div>

            <div
              onClick={() => setListerRole('lawyer')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                listerRole === 'lawyer'
                  ? 'bg-[#EBF2ED] border-[#2D5A43] ring-2 ring-[#2D5A43]/20'
                  : 'bg-white border-[#E8DFC8] hover:border-[#D7CBBB]'
              }`}>
              <Scale className="w-6 h-6 text-[#2D5A43] mb-1.5" />
              <h4 className="font-extrabold text-sm text-[#151816]">Legal Custodian (Lawyer)</h4>
              <p className="text-xs text-[#4B524D] mt-0.5">Retained counsel managing tenancy with active NBA seal.</p>
            </div>
          </div>
        </div>

        {/* Step 2: Property Specifications & 4 Cities */}
        <div className="space-y-4 pt-4 border-t border-[#E8DFC8]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
            2. Property Specifications & Location
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Listing Headline</label>
              <input
                type="text"
                placeholder="e.g. Contemporary 4-Bedroom Semi-Detached Duplex"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Target City (Covered Hubs Only)</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm font-bold text-[#151816] focus:outline-none focus:border-[#2D5A43] cursor-pointer">
                {CITIES.filter(c => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Space Category (Governs Photo Quota)</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm font-bold text-[#151816] focus:outline-none focus:border-[#2D5A43] cursor-pointer">
                <option value="residential">Residential (Min 12 Photos Required)</option>
                <option value="commercial">Commercial / Retail Plaza (Min 17 Photos Required)</option>
                <option value="industrial">Industrial / Warehouse (Min 17 Photos Required)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Neighborhood / Area</label>
              <input
                type="text"
                placeholder="e.g. Lekki Phase 1, Admiralty Way Axis"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#151816] mb-1">Full Physical Address</label>
              <input
                type="text"
                placeholder="Plot Number, Street Name, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Strict Annual Rent Direct Terms */}
        <div className="space-y-4 pt-4 border-t border-[#E8DFC8]">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
              3. Transparent Annual Financial Terms (0% Agency Commission)
            </label>
            <span className="text-[11px] font-extrabold text-[#2D5A43] bg-[#EBF2ED] px-2.5 py-0.5 rounded-full">
              Strictly Annual Lease
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Annual Rent (₦)</label>
              <input
                type="number"
                placeholder="e.g. 5000000"
                value={formData.annualRent}
                onChange={(e) => setFormData({ ...formData, annualRent: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Caution Deposit (₦ - Refundable)</label>
              <input
                type="number"
                placeholder="e.g. 400000"
                value={formData.cautionDeposit}
                onChange={(e) => setFormData({ ...formData, cautionDeposit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151816] mb-1">Service Charge (₦ / yr)</label>
              <input
                type="number"
                placeholder="e.g. 300000"
                value={formData.serviceCharge}
                onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Mandatory Transparency Photo Quota (12 for residential, 17 for commercial) */}
        <div className="space-y-4 pt-4 border-t border-[#E8DFC8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
                4. Mandatory High-Resolution Photo Transparency Quota
              </label>
              <p className="text-xs text-[#4B524D] mt-0.5">
                Must include: Street location, full length of access road, compound gates/entrances, and full interior walkthrough.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSamplePhotos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold border border-[#2D5A43]/20 hover:bg-[#2D5A43] hover:text-white transition-all cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Verified Photo Bundle ({minRequiredPhotos} Photos)</span>
            </button>
          </div>

          {/* Quota Progress Meter */}
          <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#151816]">
                Upload Status: {uploadedPhotos.length} of {minRequiredPhotos} Photos Uploaded
              </span>
              <span className={hasMetQuota ? 'text-[#2D5A43]' : 'text-[#D97706]'}>
                {hasMetQuota ? '✓ Quota Fulfilled' : `${photosRemaining} more photos needed before verification`}
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-[#E8DFC8]">
              <div
                className={`h-full rounded-full transition-all ${hasMetQuota ? 'bg-[#2D5A43]' : 'bg-[#D97706]'}`}
                style={{ width: `${Math.min(100, (uploadedPhotos.length / minRequiredPhotos) * 100)}%` }}></div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-3 rounded-2xl bg-[#FBF9F5] border border-[#E8DFC8]">
              {uploadedPhotos.map((photo, idx) => (
                <div key={photo.id} className="relative rounded-xl overflow-hidden group border border-[#E8DFC8] bg-white">
                  <img src={photo.url} alt={photo.tag} className="w-full h-24 object-cover" />
                  <div className="p-1.5 bg-white text-[10px] font-semibold text-[#151816] truncate">
                    #{idx + 1}: {photo.tag}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 5: Verification Credentials */}
        <div className="space-y-3 p-5 rounded-2xl bg-[#EBF2ED]/50 border border-[#2D5A43]/20">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3F2F] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
            5. Anti-Fraud & Custodian Proof of Authority
          </label>

          {listerRole === 'landlord' && (
            <div className="space-y-1.5 text-xs">
              <p className="text-[#3F4641]">Registered Land Title / C of O / Governor Consent File Number:</p>
              <input
                type="text"
                placeholder="e.g. Lagos State Lands Bureau File #4920/12 or C of O #..."
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
              />
            </div>
          )}

          {listerRole === 'lawyer' && (
            <div className="space-y-1.5 text-xs">
              <p className="text-[#3F4641]">Nigerian Bar Association (NBA) Supreme Court Enrollment Number:</p>
              <input
                type="text"
                placeholder="NBA Reg: e.g. SCN/049182"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
              />
            </div>
          )}

          {listerRole === 'caretaker' && (
            <div className="space-y-1.5 text-xs">
              <p className="text-[#3F4641]">Property Owner's Direct Phone Number (for 1-Minute Verification Call):</p>
              <input
                type="tel"
                placeholder="Landlord's direct phone number"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
              />
            </div>
          )}
        </div>

        {/* Dual Actions: Save as Draft vs Submit for Verification */}
        <div className="pt-4 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('draft')}
            className="w-full sm:w-1/3 py-3.5 rounded-xl bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#1E3F2F] text-xs sm:text-sm font-bold border border-[#D7CBBB] transition-all cursor-pointer flex items-center justify-center gap-2">
            <BookmarkCheck className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('pending_audit')}
            className={`w-full sm:w-2/3 py-3.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              hasMetQuota
                ? 'bg-[#2D5A43] hover:bg-[#1E3F2F]'
                : 'bg-[#2D5A43]/70 hover:bg-[#2D5A43]'
            }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Submit for Phase 1 Verification ({uploadedPhotos.length}/{minRequiredPhotos} Photos)</span>
          </button>
        </div>

      </div>
    </div>
  );
}

