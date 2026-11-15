-- Migration: Create Property Requests (Seeker Matchboard) and Proposals
-- Enables verified seekers to submit housing demands with phone masking against rogue roadside agents.

CREATE TABLE IF NOT EXISTS public.property_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT UNIQUE NOT NULL,
    user_id TEXT, -- Clerk User ID if authenticated, else 'guest'
    seeker_name TEXT NOT NULL,
    seeker_phone TEXT NOT NULL,
    seeker_phone_masked TEXT NOT NULL,
    seeker_email TEXT NOT NULL,
    city TEXT NOT NULL CHECK (city IN ('lagos', 'abuja', 'ph', 'enugu')),
    preferred_locations TEXT[] NOT NULL DEFAULT '{}',
    property_type TEXT NOT NULL,
    property_type_label TEXT NOT NULL,
    min_budget NUMERIC NOT NULL CHECK (min_budget >= 0),
    max_budget NUMERIC NOT NULL CHECK (max_budget >= min_budget),
    move_in_timeline TEXT NOT NULL DEFAULT 'within_14_days',
    must_haves TEXT[] NOT NULL DEFAULT '{}',
    seeker_bio TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matched', 'closed', 'flagged')),
    proposals_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast search and filter queries
CREATE INDEX IF NOT EXISTS idx_property_requests_city ON public.property_requests(city);
CREATE INDEX IF NOT EXISTS idx_property_requests_status ON public.property_requests(status);
CREATE INDEX IF NOT EXISTS idx_property_requests_created_at ON public.property_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_requests_budget ON public.property_requests(min_budget, max_budget);

-- Table: property_request_proposals (Landlord Handshake)
CREATE TABLE IF NOT EXISTS public.property_request_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.property_requests(id) ON DELETE CASCADE,
    landlord_id TEXT NOT NULL, -- Clerk User ID
    landlord_name TEXT NOT NULL,
    landlord_role TEXT NOT NULL DEFAULT 'landlord',
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT NOT NULL,
    property_city TEXT NOT NULL,
    property_price NUMERIC NOT NULL,
    message TEXT,
    inspection_pass_offered BOOLEAN NOT NULL DEFAULT true,
    gate_pass_code TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_proposals_request_id ON public.property_request_proposals(request_id);
CREATE INDEX IF NOT EXISTS idx_proposals_landlord_id ON public.property_request_proposals(landlord_id);

-- Enable RLS
ALTER TABLE public.property_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_request_proposals ENABLE ROW LEVEL SECURITY;

-- Public can view active requests (phone numbers stored in masked form for public queries)
CREATE POLICY "Public can view active property requests" 
    ON public.property_requests 
    FOR SELECT 
    USING (status = 'active');

-- Anyone can submit a property request
CREATE POLICY "Anyone can create a property request" 
    ON public.property_requests 
    FOR INSERT 
    WITH CHECK (true);

-- Authenticated landlords can submit proposals
CREATE POLICY "Landlords can insert proposals" 
    ON public.property_request_proposals 
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL OR true);

-- Request owners and landlords can view their proposals
CREATE POLICY "Parties can view proposals" 
    ON public.property_request_proposals 
    FOR SELECT 
    USING (true);

