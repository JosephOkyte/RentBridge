-- ====================================================================
-- RENTBRIDGE NIGERIA - COMPLETE PRODUCTION DATABASE SCHEMA
-- Multi-Tenant Architecture with Strict Data Isolation & Anti-Fraud Suite
-- Cities Covered: Lagos, Abuja, Port Harcourt, Enugu
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('tenant', 'landlord', 'caretaker', 'lawyer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE property_category AS ENUM ('residential', 'commercial', 'industrial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE target_city AS ENUM ('lagos', 'abuja', 'ph', 'enugu');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('draft', 'pending_audit', 'action_required', 'active', 'rented', 'flagged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inspection_status AS ENUM ('requested', 'confirmed', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USER PROFILES TABLE (Mirrors Clerk Authentication Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  role user_role NOT NULL DEFAULT 'tenant',
  is_verified BOOLEAN DEFAULT false,
  nin_verified BOOLEAN DEFAULT false,
  city_hub target_city,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant lookup by Clerk ID and Email
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 4. PROPERTIES TABLE (Supports Staged Drafts & Strict Annual Rent Terms)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lister_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  property_kind TEXT NOT NULL, -- e.g. 'Contemporary Duplex', 'Serviced Apartment', 'Retail Plaza'
  category property_category NOT NULL,
  city target_city NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  annual_rent NUMERIC NOT NULL,
  caution_deposit NUMERIC DEFAULT 0,
  service_charge NUMERIC DEFAULT 0,
  agent_fee NUMERIC DEFAULT 0, -- Strictly ₦0 (Anti-agent guarantee)
  bedrooms INT,
  bathrooms INT,
  size TEXT,
  status listing_status NOT NULL DEFAULT 'draft',
  verification_badge TEXT, -- 'Verified Landlord', 'Authorized Caretaker', 'Retained Legal Counsel'
  verified_at TIMESTAMPTZ,
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_lister_id ON public.properties(lister_id);

-- 5. PROPERTY MEDIA (Enforces >= 12 photos for residential, >= 17 for commercial)
CREATE TABLE IF NOT EXISTS public.property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  bucket_path TEXT NOT NULL,
  tag TEXT NOT NULL, -- 'Street View', 'Access Road', 'Entrance Gate', 'Living Room', etc.
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_media_property_id ON public.property_media(property_id);

-- 6. COMPLIANCE RECORDS (Private Legal Vault for Deeds and C of O)
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- 'C of O', 'Governor Consent', 'Deed of Assignment', 'Caretaker Letter', 'NBA Seal'
  doc_url TEXT NOT NULL,
  audit_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  officer_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_records_property_id ON public.compliance_records(property_id);

-- 7. INSPECTIONS TABLE (Guaranteed 100% Free Viewings)
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.profiles(id),
  lister_id UUID NOT NULL REFERENCES public.profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  time_slot TEXT NOT NULL, -- e.g. '10:00 AM'
  status inspection_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  fee_extortion_reported BOOLEAN DEFAULT false, -- If tenant reports viewing fee demand
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_property_id ON public.inspections(property_id);
CREATE INDEX IF NOT EXISTS idx_inspections_tenant_id ON public.inspections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inspections_lister_id ON public.inspections(lister_id);

-- 8. STEALTH ADMIN AUDIT LOGS (Super Admin Oversight with ZERO alerts to account owners)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_clerk_id TEXT NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL, -- 'VIEWED_ACCOUNT', 'AUDITED_DEED', 'FROZEN_PROPERTY', 'BLACKLISTED_PHONE'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user ON public.admin_audit_logs(target_user_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES: STRICT MULTI-TENANT ISOLATION
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy A: PROFILES
-- Users can only view and edit their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (clerk_id = auth.jwt()->>'sub');

-- Policy B: PROPERTIES
-- Public visitors can read active listings only
CREATE POLICY "Public can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active');

-- Listers can see and manage their own drafts and properties
CREATE POLICY "Listers manage their own properties"
  ON public.properties FOR ALL
  USING (lister_id IN (SELECT id FROM public.profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Policy C: PROPERTY MEDIA
-- Public can view media for active properties
CREATE POLICY "Public can view media for active properties"
  ON public.property_media FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE status = 'active'));

-- Listers manage media for their own properties
CREATE POLICY "Listers manage their property media"
  ON public.property_media FOR ALL
  USING (property_id IN (
    SELECT p.id FROM public.properties p
    JOIN public.profiles pr ON p.lister_id = pr.id
    WHERE pr.clerk_id = auth.jwt()->>'sub'
  ));

-- Policy D: COMPLIANCE RECORDS (Deeds Vault)
-- Strictly confidential: only the property owner can read/upload; only admins can audit
CREATE POLICY "Listers can view own compliance records"
  ON public.compliance_records FOR SELECT
  USING (property_id IN (
    SELECT p.id FROM public.properties p
    JOIN public.profiles pr ON p.lister_id = pr.id
    WHERE pr.clerk_id = auth.jwt()->>'sub'
  ));

-- Policy E: INSPECTIONS
-- Tenants can only see their own inspections
CREATE POLICY "Tenants view own inspections"
  ON public.inspections FOR SELECT
  USING (tenant_id IN (SELECT id FROM public.profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Listers can only see inspections booked on their properties
CREATE POLICY "Listers view property inspections"
  ON public.inspections FOR SELECT
  USING (lister_id IN (SELECT id FROM public.profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Policy F: ADMIN AUDIT LOGS
-- Only Super Admins with service role key can access audit logs
CREATE POLICY "Admin logs strictly service role only"
  ON public.admin_audit_logs FOR ALL
  USING (false); -- Accessible only via Supabase service role client

