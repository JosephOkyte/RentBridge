import React, { useState } from 'react';
import { X, ShieldCheck, Upload, Building, UserCheck, Scale, KeyRound, CheckCircle2, AlertCircle, Image as ImageIcon, Trash2, Camera, Compass } from 'lucide-react';
import { CITIES, CATEGORIES } from '../data/properties';
import { IMAGES } from '../utils/images';

export default function ListPropertyModal({ isOpen, onClose }) {
  const [listerRole, setListerRole] = useState('landlord');
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'lagos',
    neighborhood: '',
    propertyKind: 'Contemporary Duplex',
    type: 'residential', // 'residential' (min 12) or 'commercial'/'industrial' (min 17)
    priceYearly: '',
    cautionDeposit: '',
    idDocumentType: 'C of O / Deed of Assignment',
    idNumber: '',
    nbaNumber: '',
    caretakerAuthLetter: null,
  });

  // Photo uploads state
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  if (!isOpen) return null;

  // Minimum photo rule: 12 for residential, 17 for commercial/industrial
  const isResidential = formData.type === 'residential';
  const minRequiredPhotos = isResidential ? 12 : 17;
  const photosRemaining = Math.max(0, minRequiredPhotos - uploadedPhotos.length);
  const hasMetPhotoRequirement = uploadedPhotos.length >= minRequiredPhotos;

  // Handle file uploads
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      url: URL.createObjectURL(file),
      tag: uploadedPhotos.length + idx === 0 
        ? 'Street Entrance' 
        : uploadedPhotos.length + idx === 1 
        ? 'Full Street Length' 
        : uploadedPhotos.length + idx === 2 
        ? 'Main Compound Gate' 
        : `Space View ${uploadedPhotos.length + idx + 1}`
    }));

    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    setUploadError('');
  };

  // Remove photo
  const handleRemovePhoto = (idToRemove) => {
    setUploadedPhotos((prev) => prev.filter(p => p.id !== idToRemove));
  };

  // Helper demo button: Loads standard sample property photo bundle
  const handleLoadSampleSet = () => {
    const sampleLabels = isResidential
      ? [
          'Street View (Admiralty Way)', 'Full Length of Street & Access', 'Estate Security Gate',
          'Main Compound Entrance', 'Interlocked Carport & Compound', 'Exterior Front Facade',
          'Main Living Room', 'Dining Area', 'Fitted Kitchen & Pantry',
          'Master Bedroom Suite', 'Second Bedroom', 'Bathrooms & Water Heater'
        ]
      : [
          'Street View & Boulevard', 'Full Length of Street & Road Access', 'Main Plaza Entrance',
          'Customer Car Park & Apron', 'Compound Gate & Security Post', 'Plaza Exterior Facade',
          'Retail Showroom Frontage', 'Floor Space - Angle 1', 'Floor Space - Angle 2',
          'Cashier & Reception Area', 'Storage Room / Depo', 'Restrooms & Washrooms',
          'Loading Bay / Back Exit', 'Electrical Inverter / Generator House', 'Ceiling & HVAC Units',
          'Neighboring Commercial Outlets', 'Pedestrian Walkway & Street Sign'
        ];

    const sampleImages = [
      IMAGES.heroLagosDuplex,
      IMAGES.commercialAbujaBoutique,
      IMAGES.industrialWarehouse,
      IMAGES.interiorLivingRoom,
      IMAGES.heroIkoyiApartment,
      IMAGES.heroMaitamaTerrace,
      IMAGES.heroPhCommercial,
      IMAGES.heroEnuguMansion,
      IMAGES.heroLagoonWaterfront
    ];

    const generatedSet = sampleLabels.map((label, idx) => ({
      id: `sample-${idx}`,
      name: label,
      url: sampleImages[idx % sampleImages.length],
      tag: label
    }));

    setUploadedPhotos(generatedSet);
    setUploadError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasMetPhotoRequirement) {
      setUploadError(
        `Please attach at least ${minRequiredPhotos} photos (${photosRemaining} more needed) including the street where the house is located, full street length, and entrances before submitting.`
      );
      // scroll to photo section
      const photoEl = document.getElementById('photo-upload-section');
      if (photoEl) photoEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FBF9F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E2D7C8] overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#E8DFC8] flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A43]">
              <ShieldCheck className="w-4 h-4" />
              <span>Lister Portal</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#151816] mt-0.5">List Your Vacancy on RentBridge</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5EFEB] text-[#151816]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-extrabold text-[#151816]">Property & Photos Received!</h4>
            <p className="text-sm text-[#4B524D] leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-[#151816]">{formData.fullName}</strong>. You have successfully uploaded <strong className="text-[#2D5A43]">{uploadedPhotos.length} high-resolution property and street photos</strong>.
            </p>

            <div className="p-4 bg-white rounded-2xl border border-[#E8DFC8] text-xs text-left space-y-2 max-w-md mx-auto">
              <p className="font-bold text-[#151816]">Verification In Progress:</p>
              <p className="text-[#4B524D]">1. Street view and entrance access audit across {formData.neighborhood}, {formData.city}.</p>
              <p className="text-[#4B524D]">2. Verification call to {formData.phone} within 24 hours.</p>
              <p className="text-[#4B524D]">3. Property goes live on Google Map with full photo carousel for prospective tenants.</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold shadow-md">
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
            
            {/* Step 1: Select Role (Direct removed from Direct Landlord) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
                1. What is your legal relationship to this property?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Landlord */}
                <div
                  onClick={() => setListerRole('landlord')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    listerRole === 'landlord'
                      ? 'bg-[#EBF2ED] border-[#2D5A43] ring-2 ring-[#2D5A43]/20'
                      : 'bg-white border-[#E8DFC8] hover:border-[#D7CBBB]'
                  }`}>
                  <UserCheck className="w-5 h-5 text-[#2D5A43] mb-1.5" />
                  <p className="text-xs font-bold text-[#151816]">Landlord</p>
                  <p className="text-[11px] text-[#4B524D] mt-0.5">I own the title deed / C of O</p>
                </div>

                {/* Caretaker */}
                <div
                  onClick={() => setListerRole('caretaker')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    listerRole === 'caretaker'
                      ? 'bg-[#EBF2ED] border-[#2D5A43] ring-2 ring-[#2D5A43]/20'
                      : 'bg-white border-[#E8DFC8] hover:border-[#D7CBBB]'
                  }`}>
                  <KeyRound className="w-5 h-5 text-[#2D5A43] mb-1.5" />
                  <p className="text-xs font-bold text-[#151816]">Authorized Caretaker</p>
                  <p className="text-[11px] text-[#4B524D] mt-0.5">I have owner's power of custody</p>
                </div>

                {/* Lawyer */}
                <div
                  onClick={() => setListerRole('lawyer')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    listerRole === 'lawyer'
                      ? 'bg-[#EBF2ED] border-[#2D5A43] ring-2 ring-[#2D5A43]/20'
                      : 'bg-white border-[#E8DFC8] hover:border-[#D7CBBB]'
                  }`}>
                  <Scale className="w-5 h-5 text-[#2D5A43] mb-1.5" />
                  <p className="text-xs font-bold text-[#151816]">Legal Custodian</p>
                  <p className="text-[11px] text-[#4B524D] mt-0.5">Retained estate attorney / NBA</p>
                </div>

              </div>
            </div>

            {/* Step 2: Lister Contact Info */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DFC8]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
                2. Your Authenticated Contact Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barrister / Engr / Mallam..."
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">Active Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Location & Category */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DFC8]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
                3. Vacancy Location & Specs
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs font-bold focus:outline-none cursor-pointer">
                    {CITIES.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">Neighborhood / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1, Wuse 2, Bodija"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs font-bold focus:outline-none cursor-pointer">
                    <option value="residential">Residential (House / Flat / Duplex)</option>
                    <option value="commercial">Commercial (Shop / Plaza / Retail)</option>
                    <option value="industrial">Commercial / Industrial (Warehouse / Logistics)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MANDATORY FULL-VIEW PHOTO UPLOAD SECTION */}
            <div id="photo-upload-section" className="space-y-4 bg-white p-5 rounded-2xl border-2 border-[#E2D7C8] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#2D5A43]" />
                    <h4 className="text-sm font-extrabold text-[#151816]">
                      Comprehensive Photo Transparency Upload
                    </h4>
                  </div>
                  <p className="text-xs text-[#4B524D] mt-0.5">
                    Tenants must have a full view before inspecting. Street, entrances, and full surroundings are strictly required.
                  </p>
                </div>

                {/* Quota Badge Indicator */}
                <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 self-start sm:self-auto ${
                  hasMetPhotoRequirement 
                    ? 'bg-[#EBF2ED] text-[#2D5A43] border border-[#8AE0B3]' 
                    : 'bg-[#FFF9F9] text-[#B91C1C] border border-[#F2D6D6]'
                }`}>
                  {hasMetPhotoRequirement ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#2D5A43]" />
                      <span>{uploadedPhotos.length} / {minRequiredPhotos} Photos (Target Met)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-[#B91C1C]" />
                      <span>{uploadedPhotos.length} / {minRequiredPhotos} Min Required ({photosRemaining} more needed)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Requirement Rule Callout */}
              <div className="p-3.5 rounded-xl bg-[#F5EFEB] border border-[#E2D7C8] text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-[#151816]">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#2D5A43]" />
                    Mandatory Photographic Standards:
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#2D5A43] text-white">
                    {isResidential ? 'Minimum 12 Pictures for Residential' : 'Minimum 17 Pictures for Commercial/Industrial'}
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#4B524D]">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]"></span>
                    <strong>Street Location:</strong> The exact street where house/shop is situated.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]"></span>
                    <strong>Full Street Length:</strong> View showing approach road & drainage.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]"></span>
                    <strong>Compound Entrances:</strong> Main gate, pedestrian entrance, security post.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]"></span>
                    <strong>Full Interior & Exterior:</strong> Rooms, kitchen, parking, loading areas.
                  </li>
                </ul>
              </div>

              {/* Upload Dropzone & Action */}
              <div className="border-2 border-dashed border-[#D7CBBB] hover:border-[#2D5A43] rounded-2xl p-6 text-center bg-[#FBF9F5] transition-colors relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-12 h-12 rounded-2xl bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#151816]">
                  Click or drag & drop to upload property pictures
                </p>
                <p className="text-[11px] text-[#8F8372] mt-0.5">
                  Select {minRequiredPhotos}+ photos from your device (JPG, PNG, WebP)
                </p>
              </div>

              {/* Demo Helper Button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#8F8372]">Quick Review Helper:</span>
                <button
                  type="button"
                  onClick={handleLoadSampleSet}
                  className="px-3 py-1.5 rounded-lg bg-[#EBF2ED] hover:bg-[#DCECE1] text-[#2D5A43] font-bold text-xs flex items-center gap-1.5 border border-[#8AE0B3]/40 cursor-pointer">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Attach Full {minRequiredPhotos}-Photo Sample Set</span>
                </button>
              </div>

              {/* Validation Error Notice if attempted submit without quota */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-[#FFF5F5] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Uploaded Photos Gallery Preview */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-[#151816]">
                    Attached Photos Preview ({uploadedPhotos.length}):
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1 border border-[#E8DFC8] rounded-xl bg-[#FBF9F5]">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-[#E2D7C8] bg-white aspect-square shadow-xs">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                          #{index + 1}
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-semibold px-1 py-0.5 truncate">
                          {photo.tag}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Step 4: Annual Rent Pricing */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8372]">
                  4. Annual Rent Pricing
                </label>
                <span className="text-[11px] font-bold text-[#2D5A43] bg-[#EBF2ED] px-2 py-0.5 rounded">
                  Annual Lease Terms Only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">Annual Rent (₦ / year)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4000000"
                    value={formData.priceYearly}
                    onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#151816] mb-1">Caution Deposit (₦ - Refundable)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 350000"
                    value={formData.cautionDeposit}
                    onChange={(e) => setFormData({ ...formData, cautionDeposit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Verification Credentials */}
            <div className="space-y-3 bg-[#EBF2ED]/60 p-4 rounded-2xl border border-[#2D5A43]/20">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3F2F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
                5. Mandatory Anti-Fraud Documents
              </label>

              {listerRole === 'landlord' && (
                <div className="space-y-2 text-xs">
                  <p className="text-[#3F4641]">
                    Enter your registered land document reference (C of O Number, Governor's Consent, or Registered Deed):
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Lands Bureau File #4920/12 or C of O #..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
              )}

              {listerRole === 'caretaker' && (
                <div className="space-y-2 text-xs">
                  <p className="text-[#3F4641]">
                    Enter the property owner's direct telephone number for our verification call:
                  </p>
                  <input
                    type="tel"
                    required
                    placeholder="Landlord's direct phone number"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
              )}

              {listerRole === 'lawyer' && (
                <div className="space-y-2 text-xs">
                  <p className="text-[#3F4641]">
                    Enter your Nigerian Bar Association (NBA) Supreme Court Enrollment Number:
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="NBA Reg: e.g. SCN/049182"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
                  />
                </div>
              )}

              <p className="text-[11px] text-[#4B524D] pt-1">
                Notice: RentBridge strict compliance policy rejects any street agency middlemen. Listings are reviewed within 24 hours.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold shadow-md transition-all cursor-pointer">
                Submit Property & Photos for Verification
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
