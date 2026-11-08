-- ====================================================================
-- RENTBRIDGE NIGERIA - COMPLETE PRODUCTION DATABASE SETUP & SEED
-- Bridging the gap between landlords and tenants across Nigeria
-- Target Cities: Lagos, Abuja, Port Harcourt, Enugu
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING POLICIES (for safe re-runs)
DROP POLICY IF EXISTS "Public can view active properties" ON public.properties;
DROP POLICY IF EXISTS "Listers manage their own properties" ON public.properties;
DROP POLICY IF EXISTS "Public can view media for active properties" ON public.property_media;
DROP POLICY IF EXISTS "Listers manage their property media" ON public.property_media;
DROP POLICY IF EXISTS "Listers can view own compliance records" ON public.compliance_records;
DROP POLICY IF EXISTS "Tenants view own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Listers view property inspections" ON public.inspections;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin logs strictly service role only" ON public.admin_audit_logs;

-- 3. PROFILES TABLE (Mirrors Clerk Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord', 'caretaker', 'lawyer', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  nin_verified BOOLEAN DEFAULT false,
  city_hub TEXT DEFAULT 'lagos',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 4. PROPERTIES TABLE (Strict ₦0 Agent Fee, Staged Drafts & Photo Quotas)
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY DEFAULT ('prop-' || floor(extract(epoch from now()) * 1000)::text),
  lister_clerk_id TEXT,
  lister_name TEXT NOT NULL DEFAULT 'Verified Property Custodian',
  lister_email TEXT,
  lister_phone TEXT,
  lister_whatsapp TEXT,
  lister_role TEXT NOT NULL DEFAULT 'landlord' CHECK (lister_role IN ('landlord', 'caretaker', 'lawyer')),
  title TEXT NOT NULL,
  property_kind TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'industrial')),
  city TEXT NOT NULL CHECK (city IN ('lagos', 'abuja', 'ph', 'enugu')),
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  annual_rent NUMERIC NOT NULL,
  caution_deposit NUMERIC DEFAULT 0,
  service_charge NUMERIC DEFAULT 0,
  agent_fee NUMERIC DEFAULT 0, -- Strictly ₦0
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  size TEXT,
  image TEXT,
  photo_count INT DEFAULT 0,
  min_required_photos INT DEFAULT 12,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_audit', 'action_required', 'active', 'rented', 'flagged')),
  verification_badge TEXT,
  verified_at TIMESTAMPTZ,
  id_document_type TEXT,
  id_number TEXT,
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_lister_clerk_id ON public.properties(lister_clerk_id);

-- 5. PROPERTY MEDIA (Photo Transparency Standard)
CREATE TABLE IF NOT EXISTS public.property_media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  bucket_path TEXT NOT NULL,
  tag TEXT NOT NULL, -- 'Street View', 'Access Road', 'Entrance Gate', 'Living Room', etc.
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_media_property_id ON public.property_media(property_id);

-- 6. COMPLIANCE RECORDS (Private Legal Deed Vault)
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  doc_url TEXT NOT NULL,
  audit_status TEXT NOT NULL DEFAULT 'pending' CHECK (audit_status IN ('pending', 'approved', 'rejected')),
  officer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_records_property_id ON public.compliance_records(property_id);

-- 7. INSPECTIONS TABLE (100% Free Viewings & Anti-Extortion Tracking)
CREATE TABLE IF NOT EXISTS public.inspections (
  id TEXT PRIMARY KEY DEFAULT ('insp-' || floor(extract(epoch from now()) * 1000)::text),
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  property_title TEXT,
  tenant_clerk_id TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  tenant_phone TEXT,
  lister_name TEXT,
  lister_phone TEXT,
  scheduled_at TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  fee_extortion_reported BOOLEAN DEFAULT false,
  extortion_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_property_id ON public.inspections(property_id);
CREATE INDEX IF NOT EXISTS idx_inspections_tenant_clerk_id ON public.inspections(tenant_clerk_id);

-- 8. STEALTH ADMIN AUDIT LOGS (Zero notification to account owners)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  admin_clerk_id TEXT NOT NULL,
  target_user_id TEXT,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user ON public.admin_audit_logs(target_user_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (clerk_id = auth.jwt()->>'sub');

-- 2. Properties: Public can view active vacancies
CREATE POLICY "Public can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active');

CREATE POLICY "Listers manage their own properties"
  ON public.properties FOR ALL
  USING (lister_clerk_id = auth.jwt()->>'sub');

-- 3. Property Media: Public can view media for active vacancies
CREATE POLICY "Public can view media for active properties"
  ON public.property_media FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE status = 'active'));

CREATE POLICY "Listers manage their property media"
  ON public.property_media FOR ALL
  USING (property_id IN (SELECT id FROM public.properties WHERE lister_clerk_id = auth.jwt()->>'sub'));

-- 4. Compliance Records
CREATE POLICY "Listers can view own compliance records"
  ON public.compliance_records FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE lister_clerk_id = auth.jwt()->>'sub'));

-- 5. Inspections
CREATE POLICY "Tenants view own inspections"
  ON public.inspections FOR SELECT
  USING (tenant_clerk_id = auth.jwt()->>'sub');

-- 6. Admin Logs
CREATE POLICY "Admin logs strictly service role only"
  ON public.admin_audit_logs FOR ALL
  USING (false);

-- ====================================================================
-- INITIAL SEED DATA: 9 VERIFIED DIRECT VACANCIES
-- Across Lagos, Abuja, Port Harcourt, and Enugu
-- ====================================================================

-- Seed Profiles
INSERT INTO public.profiles (clerk_id, email, full_name, phone, whatsapp, role, is_verified, city_hub)
VALUES
  ('seed_landlord_dapo', 'dapo.alabi@gmail.com', 'Engr. Dapo Alabi (Owner)', '+234 803 445 1928', '2348034451928', 'landlord', true, 'lagos'),
  ('seed_lawyer_nkechi', 'nkechi.umeh@legalcustody.ng', 'Barrister Nkechi Umeh', '+234 812 990 4120', '2348129904120', 'lawyer', true, 'abuja'),
  ('seed_caretaker_emeka', 'emeka.nnamdi@caretaker.ng', 'Mr. Emeka Nnamdi (Resident Caretaker)', '+234 803 112 9901', '2348031129901', 'caretaker', true, 'lagos'),
  ('seed_lawyer_chibuike', 'chibuike.amadi@lawfirm.ng', 'Barr. Chibuike Amadi (SAN Retained)', '+234 809 778 3344', '2348097783344', 'lawyer', true, 'ph'),
  ('seed_landlord_mustapha', 'alhadji.mustapha@gmail.com', 'Alhaji Mustapha Bello (Property Owner)', '+234 802 334 5566', '2348023345566', 'landlord', true, 'abuja'),
  ('seed_lawyer_folake', 'folake.adesina@chambers.ng', 'Barrister Folake Adesina (Legal Custodian)', '+234 805 667 8899', '2348056678899', 'lawyer', true, 'lagos'),
  ('seed_caretaker_godwin', 'godwin.tamuno@caretaker.ng', 'Captain Godwin Tamuno (Head Caretaker)', '+234 803 998 2211', '2348039982211', 'caretaker', true, 'ph'),
  ('seed_landlord_segun', 'segun.ogundimu@techrealestate.ng', 'Dr. Segun Ogundimu (Owner)', '+234 808 123 9988', '2348081239988', 'landlord', true, 'lagos'),
  ('seed_landlord_obinna', 'obinna.eze@enuguproperties.ng', 'Chief Obinna Eze (Title Holder)', '+234 806 443 2211', '2348064432211', 'landlord', true, 'enugu')
ON CONFLICT (clerk_id) DO NOTHING;

-- Seed Properties
INSERT INTO public.properties (
  id, lister_clerk_id, lister_name, lister_phone, lister_whatsapp, lister_role,
  title, property_kind, category, city, neighborhood, address, latitude, longitude,
  annual_rent, caution_deposit, service_charge, agent_fee, bedrooms, bathrooms, size,
  image, photo_count, min_required_photos, status, verification_badge, verified_at,
  id_document_type, id_number, description, features
)
VALUES
  (
    'prop-1', 'seed_landlord_dapo', 'Engr. Dapo Alabi (Owner)', '+234 803 445 1928', '2348034451928', 'landlord',
    'Luxury 4-Bedroom Semi-Detached Duplex', 'Contemporary Duplex', 'residential', 'lagos',
    'Lekki Phase 1, Admiralty Way Axis', 'Plot 14, Block 8, Off Admiralty Way, Lekki Phase 1, Lagos', 6.4474, 3.4735,
    14000000, 1000000, 1200000, 0, 4, 5, '420 sqm',
    '/images/hero-lagos-duplex.jpg', 14, 12, 'active', 'Verified Landlord', NOW(),
    'Lagos State Lands Bureau C of O', 'LOS/LK/2019/8492',
    'Direct from property owner. Newly refurbished 4-bedroom duplex in a serene, secure gated close in Lekki Phase 1. Features high ceilings, contemporary architecture, modern fitted kitchen, and en-suite domestic staff quarter (BQ). Available on annual lease terms.',
    ARRAY['Zero Agent Wahala (₦0 Agent Fee)', '24/7 Gated Estate Security', 'Flood-Free Interlocked Compound', 'Dedicated Inverter & Central Generator', 'Prepaid Smart Metre', 'Ample 4-Car Parking']
  ),
  (
    'prop-2', 'seed_lawyer_nkechi', 'Barrister Nkechi Umeh', '+234 812 990 4120', '2348129904120', 'lawyer',
    'Prime High-Street Retail Boutique & Showroom', 'Commercial Plaza Shop', 'commercial', 'abuja',
    'Wuse 2, Aminu Kano Crescent', 'Suite B12, Regent Crest Plaza, Aminu Kano Crescent, Wuse 2, Abuja', 9.0722, 7.4756,
    9500000, 800000, 900000, 0, 0, 2, '95 sqm',
    '/images/commercial-abuja-boutique.jpg', 18, 17, 'active', 'Accredited Legal Custodian', NOW(),
    'Supreme Court Bar Practicing Seal & Registered Power of Attorney', 'NBA/SCN/48291',
    'Directly managed by retained legal counsel for the property estate. High-visibility ground floor retail shop ideal for fashion boutique, beauty lounge, electronics showroom, or cafe in the bustling heart of Wuse 2.',
    ARRAY['Heavy Foot Traffic Commercial Plaza', 'Zero Middleman Markup', 'Central 250kVA Standby Generator', 'Full Glass Frontage Display', 'Dedicated Customer Basement Parking', 'Armed Facility Security']
  ),
  (
    'prop-3', 'seed_caretaker_emeka', 'Mr. Emeka Nnamdi (Resident Caretaker)', '+234 803 112 9901', '2348031129901', 'caretaker',
    'Ultra-Modern 3-Bedroom Serviced Waterfront Apartment', 'Serviced Luxury Flat', 'residential', 'lagos',
    'Ikoyi Waterfront Corridor', 'Apartment 4A, Horizon Lagoon Towers, Alexander Avenue, Ikoyi, Lagos', 6.4531, 3.4358,
    18500000, 1500000, 2400000, 0, 3, 4, '310 sqm',
    '/images/hero_slider_ikoyi_apartment.jpg', 15, 12, 'active', 'Authorized Resident Caretaker', NOW(),
    'Notarized Caretaker Power of Custody', 'LOS/IKY/2023/1102',
    'Direct resident caretaker custody with zero agent fee. Luxury waterfront high-rise apartment offering panoramic views of the Lagos Lagoon. Comes with private jetty access, Olympic swimming pool, fully equipped gym, and 24-hour uninterrupted central power.',
    ARRAY['Zero Agent Markups', 'Lagoon Waterfront Scenery', '24/7 Uninterrupted Electricity', 'Olympic-size Pool & Squash Court', 'Private Boat Jetty Access', 'Smart Elevator & Access Card Entry']
  ),
  (
    'prop-4', 'seed_lawyer_chibuike', 'Barr. Chibuike Amadi (SAN Retained)', '+234 809 778 3344', '2348097783344', 'lawyer',
    'Commercial Distribution & Logistics Hub (Warehouse)', 'Industrial Logistics Facility', 'industrial', 'ph',
    'Trans-Amadi Industrial Layout', 'Plot 18B, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State', 4.8194, 7.0392,
    16000000, 1500000, 1000000, 0, 0, 4, '1,250 sqm',
    '/images/industrial-warehouse.jpg', 19, 17, 'active', 'Retained Legal Counsel', NOW(),
    'Rivers State Lands Registry Deed of Assignment', 'RVS/PH/TA/2018/092',
    'Represented by retained Senior Advocate law firm. Massive high-cube logistics and storage warehouse situated on the primary arterial road of Trans-Amadi. Heavy-duty reinforced concrete flooring, wide turning apron for 40ft container articulated trailers.',
    ARRAY['Zero Broker Commission', '40ft Articulated Trailer Turning Apron', '8-Metre Stacking Clear Height', 'Dedicated 500kVA Transformer', 'Integrated 2-Floor Admin Office Block', 'Dual Industrial Security Gates']
  ),
  (
    'prop-5', 'seed_landlord_mustapha', 'Alhaji Mustapha Bello (Property Owner)', '+234 802 334 5566', '2348023345566', 'landlord',
    'Contemporary Diplomatic 5-Bedroom Terrace with Private Pool', 'Executive Gated Terrace', 'residential', 'abuja',
    'Maitama Diplomatic Zone', 'Villa 6, Aso Vista Enclave, Amazon Street, Maitama, Abuja', 9.0882, 7.4961,
    24000000, 2000000, 1800000, 0, 5, 6, '580 sqm',
    '/images/hero_slider_maitama_terrace.jpg', 16, 12, 'active', 'Verified Title Holder', NOW(),
    'FCDA Certificate of Occupancy', 'FCDA/CO/MISC/2016/4401',
    'Direct from property owner. Architectural masterpiece situated in a serene diplomatic close in Maitama. Features private plunge pool, double-volume living area, bulletproof security access doors, elevator shaft, and lush courtyard.',
    ARRAY['Zero Agent Wahala (₦0 Agent Fee)', 'Diplomatic Enclave Security', 'Private Plunge Pool & Sun Deck', 'Fitted Italian Granite Kitchen', 'Dedicated Solar-Inverter Central Grid', 'Motorized Gate with Access Control']
  ),
  (
    'prop-6', 'seed_lawyer_folake', 'Barrister Folake Adesina (Legal Custodian)', '+234 805 667 8899', '2348056678899', 'lawyer',
    'Prime Corporate Headquarters & Open-Plan Office Suites', 'Commercial Office Complex', 'commercial', 'lagos',
    'Victoria Island Financial District', 'Floor 5, Apex Towers, Adeola Odeku Street, Victoria Island, Lagos', 6.4281, 3.4219,
    32000000, 3000000, 3500000, 0, 0, 8, '450 sqm',
    '/images/hero_slider_lagoon_waterfront.jpg', 17, 17, 'active', 'Verified Legal Custodian', NOW(),
    'Federal Land Registry Title', 'FLR/VI/AO/2015/319',
    'Fully open-plan commercial floor space suited for multinational corporate headquarters, financial institutions, tech consultancy, or executive law chambers. Comes fully fitted with raised access flooring and VRV central air-conditioning.',
    ARRAY['Zero Broker Surcharge', 'Raised Access Flooring for Cabling', 'Dual Backup 500kVA Generators', 'Double High-Speed Passenger Lifts', 'Basement & Surface Parking (12 slots)', 'Fire Suppression & FM200 Systems']
  ),
  (
    'prop-7', 'seed_caretaker_godwin', 'Captain Godwin Tamuno (Head Caretaker)', '+234 803 998 2211', '2348039982211', 'caretaker',
    'Executive 4-Bedroom Waterfront Penthouse & Private Lounge', 'Luxury Penthouse', 'residential', 'ph',
    'Peter Odili / Trans-Amadi Waterline', 'Penthouse East, Marine Crest Heights, Peter Odili Road, Port Harcourt', 4.8021, 7.0411,
    15000000, 1000000, 1500000, 0, 4, 5, '390 sqm',
    '/images/hero_slider_ph_commercial.jpg', 14, 12, 'active', 'Verified Caretaker', NOW(),
    'Power of Custody Certificate', 'RVS/POC/2022/881',
    'Direct resident caretaker management with strictly zero agency fees. High-luxury duplex penthouse with wrap-around terrace overlooking the Port Harcourt waterline. Italian marble flooring and automated lighting.',
    ARRAY['Zero Agent Fee Guaranteed', 'Wrap-around Waterfront Terrace', 'Automated Lighting & Curtain Tracks', 'Dedicated 2-Car Covered Port', 'Treated Water Reticulation System', 'CCTV & Biometric Entry Gate']
  ),
  (
    'prop-8', 'seed_landlord_segun', 'Dr. Segun Ogundimu (Owner)', '+234 808 123 9988', '2348081239988', 'landlord',
    'Contemporary Tech Studio & Co-Work Creative Loft', 'Creative Commercial Space', 'commercial', 'lagos',
    'Yaba Tech Valley Corridor', '3rd Floor, Silicon Enclave, Herbert Macaulay Way, Yaba, Lagos', 6.5095, 3.3792,
    4800000, 400000, 500000, 0, 1, 2, '85 sqm',
    '/images/hero_slider_abuja_gwarinpa_plaza.jpg', 18, 17, 'active', 'Direct Landlord', NOW(),
    'Lagos Land Registry Deed of Sublease', 'LOS/YB/HM/2020/094',
    'Direct from property landlord. Modern creative office loft ideal for tech startups, media production, software studios, or architectural design agencies in the buzzing heart of Yaba Tech Valley. High-speed fibre broadband enabled.',
    ARRAY['Zero Middleman Fees', 'Redundant Fibre-Optic Internet Ducts', '24/7 Power Backup (Solar + Gen)', 'Soundproof Acoustic Pods', 'Communal Rooftop Coffee Lounge', 'Secured Keycard Access']
  ),
  (
    'prop-9', 'seed_landlord_obinna', 'Chief Obinna Eze (Title Holder)', '+234 806 443 2211', '2348064432211', 'landlord',
    'Prime Contemporary 5-Bedroom Residential Compound', 'Contemporary Mansion', 'residential', 'enugu',
    'Independence Layout Gated Area', 'Plot 8, Presidential Close, Off Bisalla Road, Independence Layout, Enugu', 6.4522, 7.5105,
    6500000, 500000, 400000, 0, 5, 5, '550 sqm',
    '/images/hero_slider_enugu_mansion.jpg', 15, 12, 'active', 'Verified Title Holder', NOW(),
    'Enugu State Ministry of Lands C of O', 'EN/INDEP/2017/0481',
    'Direct from title holder. Palatial contemporary 5-bedroom detached residence situated on a full plot in premier Independence Layout. Features extensive manicured lawns, interlocked private compound, modern POP ceilings, and perimeter solar lighting.',
    ARRAY['Strictly Zero Middleman Markup', 'Full Plot Private Compound', 'Perimeter Electric Security Fence', 'Dedicated Deep Borehole & Filtration', 'Solar Inverter Setup Installed', 'En-suite BQ & Gatehouse']
  )
ON CONFLICT (id) DO NOTHING;
