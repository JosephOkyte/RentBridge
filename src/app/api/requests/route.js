import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '../../../lib/supabase/server';
import { getInMemoryRequests, addInMemoryRequest } from '../../../data/requests';

// Helper to mask Nigerian phone number (e.g. +234 803 123 4567 -> +234 803 ••• 4567)
function maskPhoneNumber(phone) {
  if (!phone) return '+234 ••• ••• ••••';
  const clean = phone.trim();
  if (clean.length >= 10) {
    const start = clean.slice(0, 8);
    const end = clean.slice(-4);
    return `${start} ••• ${end}`;
  }
  return '+234 ••• ••• ••••';
}

// Generate unique branded ticket ID (e.g. REQ-LK-48192)
function generateTicketId(city) {
  const cityCode = {
    lagos: 'LK',
    abuja: 'ABJ',
    ph: 'PH',
    enugu: 'ENU',
  }[city?.toLowerCase()] || 'RB';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `REQ-${cityCode}-${randomNum}`;
}

/**
 * GET: Fetch active seeker requests with optional city & propertyType filters
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const propertyType = searchParams.get('propertyType');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');

    try {
      const supabase = await createClient();
      let query = supabase
        .from('property_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (city && city !== 'all') {
        query = query.eq('city', city.toLowerCase());
      }
      if (propertyType && propertyType !== 'all') {
        query = query.eq('property_type', propertyType);
      }
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ requests: data, source: 'supabase' });
      }
    } catch (dbErr) {
      console.warn('Supabase request fetch warning, falling back to local store:', dbErr.message);
    }

    // Fallback to in-memory / seed requests
    let filtered = getInMemoryRequests();

    if (city && city !== 'all') {
      filtered = filtered.filter(r => r.city === city.toLowerCase());
    }
    if (propertyType && propertyType !== 'all') {
      filtered = filtered.filter(r => r.propertyType === propertyType);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.seekerName.toLowerCase().includes(q) ||
        r.ticketId.toLowerCase().includes(q) ||
        r.preferredLocations?.some(loc => loc.toLowerCase().includes(q)) ||
        r.seekerBio?.toLowerCase().includes(q)
      );
    }
    if (userId) {
      filtered = filtered.filter(r => r.userId === userId);
    }

    return NextResponse.json({ requests: filtered, source: 'in_memory' });
  } catch (err) {
    console.error('Requests GET API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Submit a new Housing Request (Wanted Ticket)
 * Includes double-submit protection, Nigerian phone validation, and phone number privacy masking.
 */
export async function POST(request) {
  try {
    const user = await currentUser();
    const body = await request.json();

    const {
      seekerName,
      seekerPhone,
      seekerEmail,
      city,
      preferredLocations,
      propertyType,
      propertyTypeLabel,
      minBudget,
      maxBudget,
      moveInTimeline,
      moveInTimelineLabel,
      mustHaves,
      seekerBio,
    } = body;

    // Strict Validation
    if (!seekerName || !seekerName.trim()) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!seekerPhone || !seekerPhone.trim()) {
      return NextResponse.json({ error: 'Please enter a valid Nigerian phone number.' }, { status: 400 });
    }

    const cleanPhone = seekerPhone.replace(/\s+/g, '');
    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({
        error: 'Please provide a valid 11-digit Nigerian phone number (e.g. 0803 123 4567 or +234 803 123 4567).'
      }, { status: 400 });
    }

    if (!seekerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(seekerEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!city || !['lagos', 'abuja', 'ph', 'enugu'].includes(city.toLowerCase())) {
      return NextResponse.json({ error: 'Please select a valid hub (Lagos, Abuja, Port Harcourt, or Enugu).' }, { status: 400 });
    }

    const numMin = Number(minBudget) || 0;
    const numMax = Number(maxBudget) || 0;
    if (numMax <= 0 || numMax < numMin) {
      return NextResponse.json({ error: 'Maximum budget must be greater than or equal to minimum budget.' }, { status: 400 });
    }

    const ticketId = generateTicketId(city);
    const maskedPhone = maskPhoneNumber(cleanPhone);
    const cityNameMap = {
      lagos: 'Lagos',
      abuja: 'Abuja',
      ph: 'Port Harcourt',
      enugu: 'Enugu',
    };

    const newRequest = {
      id: `req-${Date.now()}`,
      ticketId,
      userId: user?.id || 'guest',
      seekerName: seekerName.trim(),
      seekerPhone: cleanPhone,
      seekerPhoneMasked: maskedPhone,
      seekerEmail: seekerEmail.trim().toLowerCase(),
      city: city.toLowerCase(),
      cityName: cityNameMap[city.toLowerCase()] || city,
      preferredLocations: Array.isArray(preferredLocations) && preferredLocations.length > 0 ? preferredLocations : ['Flexible within hub'],
      propertyType: propertyType || 'residential',
      propertyTypeLabel: propertyTypeLabel || 'Apartment / House',
      minBudget: numMin,
      maxBudget: numMax,
      moveInTimeline: moveInTimeline || 'within_14_days',
      moveInTimelineLabel: moveInTimelineLabel || 'Within 14 Days',
      mustHaves: Array.isArray(mustHaves) ? mustHaves : [],
      seekerBio: seekerBio?.trim() || 'Verified prospective tenant seeking direct custodian connection.',
      status: 'active',
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Attempt Supabase insert
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('property_requests')
        .insert({
          ticket_id: newRequest.ticketId,
          user_id: newRequest.userId,
          seeker_name: newRequest.seekerName,
          seeker_phone: newRequest.seekerPhone,
          seeker_phone_masked: newRequest.seekerPhoneMasked,
          seeker_email: newRequest.seekerEmail,
          city: newRequest.city,
          preferred_locations: newRequest.preferredLocations,
          property_type: newRequest.propertyType,
          property_type_label: newRequest.propertyTypeLabel,
          min_budget: newRequest.minBudget,
          max_budget: newRequest.maxBudget,
          move_in_timeline: newRequest.moveInTimeline,
          must_haves: newRequest.mustHaves,
          seeker_bio: newRequest.seekerBio,
          status: 'active',
          proposals_count: 0,
        })
        .select()
        .single();

      if (!error && data) {
        addInMemoryRequest(newRequest);
        return NextResponse.json({ success: true, request: data, source: 'supabase' }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn('Supabase insert fallback:', dbErr.message);
    }

    // In-memory fallback
    addInMemoryRequest(newRequest);

    return NextResponse.json({
      success: true,
      request: newRequest,
      source: 'in_memory'
    }, { status: 201 });
  } catch (err) {
    console.error('Requests POST API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

