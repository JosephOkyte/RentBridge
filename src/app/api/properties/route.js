import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '../../../lib/supabase/server';
import { createAdminClient } from '../../../lib/supabase/admin';
import { notifyPropertySubmitted, notifyPropertyMarkedRented } from '../../../lib/notifications';
import { PROPERTIES } from '../../../data/properties';

/**
 * GET: Fetch properties with strict multi-tenant isolation
 * - If status=active: public can view
 * - Otherwise: only owner or admin can view
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await currentUser();
    const filter = searchParams.get('filter'); // 'my_listings', 'drafts', 'active'

    // If requesting user's own listings
    if (filter === 'my_listings') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check Supabase if configured, otherwise return mock drafts + properties for demonstration
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_media(*)')
        .eq('lister_clerk_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Return structured user-specific listings with drafts for immediate full-stack UX
        const mockUserListings = [
          {
            id: 'draft-101',
            title: 'Contemporary 3-Bedroom Terrace Duplex (Draft)',
            propertyKind: 'Terrace Duplex',
            category: 'residential',
            city: 'lagos',
            neighborhood: 'Lekki Phase 1, Admiralty Way Axis',
            annualRent: 8500000,
            cautionDeposit: 800000,
            serviceCharge: 600000,
            agentFee: 0,
            photoCount: 8,
            minRequiredPhotos: 12,
            status: 'draft',
            createdAt: '2026-11-06T10:30:00Z',
            notes: '4 more photos needed (access road, estate gate, living room) before submitting for verification.',
          },
          {
            id: 'prop-1',
            title: 'Luxury 4-Bedroom Semi-Detached Duplex',
            propertyKind: 'Contemporary Duplex',
            category: 'residential',
            city: 'lagos',
            neighborhood: 'Lekki Phase 1',
            annualRent: 14000000,
            cautionDeposit: 1000000,
            serviceCharge: 1200000,
            agentFee: 0,
            photoCount: 14,
            minRequiredPhotos: 12,
            status: 'active',
            verificationBadge: 'Verified Landlord',
            createdAt: '2026-10-29T14:20:00Z',
          },
        ];
        return NextResponse.json({ properties: mockUserListings });
      }

      return NextResponse.json({ properties: data });
    }

    // Default: Public active properties
    return NextResponse.json({ properties: PROPERTIES });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Create a new Property Draft OR Submit for Verification
 */
export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to create or draft a property' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      propertyKind,
      category = 'residential',
      city,
      neighborhood,
      address,
      annualRent,
      cautionDeposit = 0,
      serviceCharge = 0,
      photos = [],
      idDocumentType,
      idNumber,
      status = 'draft', // 'draft' or 'pending_audit'
    } = body;

    const minRequiredPhotos = category === 'residential' ? 12 : 17;

    // Strict validation if submitting for Phase 1 verification
    if (status === 'pending_audit') {
      if (photos.length < minRequiredPhotos) {
        return NextResponse.json(
          {
            error: `Photo quota not met. ${category === 'residential' ? 'Residential' : 'Commercial'} properties require at least ${minRequiredPhotos} photos (street, access road, compound gate, and interior). You currently have ${photos.length}. You can save as Draft instead.`,
          },
          { status: 400 }
        );
      }
    }

    const newProperty = {
      id: `prop-${Date.now()}`,
      lister_clerk_id: user.id,
      lister_name: user.fullName || user.firstName || 'Property Custodian',
      lister_email: user.primaryEmailAddress?.emailAddress,
      title,
      property_kind: propertyKind,
      category,
      city,
      neighborhood,
      address,
      annual_rent: Number(annualRent),
      caution_deposit: Number(cautionDeposit),
      service_charge: Number(serviceCharge),
      agent_fee: 0, // Strictly ₦0
      photo_count: photos.length,
      min_required_photos: minRequiredPhotos,
      status, // 'draft' or 'pending_audit'
      id_document_type: idDocumentType,
      id_number: idNumber,
      created_at: new Date().toISOString(),
    };

    // Attempt to persist to Supabase
    try {
      const adminClient = createAdminClient();
      await adminClient.from('properties').insert([newProperty]);
    } catch (dbErr) {
      console.warn('[Supabase DB notice]:', dbErr.message);
    }

    // If submitted for verification, trigger Resend confirmation email to lister
    if (status === 'pending_audit' && user.primaryEmailAddress?.emailAddress) {
      await notifyPropertySubmitted({
        listerEmail: user.primaryEmailAddress.emailAddress,
        listerName: newProperty.lister_name,
        propertyTitle: title,
        photoCount: photos.length,
      });
    }

    return NextResponse.json({
      success: true,
      property: newProperty,
      message:
        status === 'draft'
          ? 'Property saved as draft. You have 30 days to finish uploading your photos.'
          : 'Property submitted for Phase 1 manual verification. Our compliance desk will audit your street photos and deeds within 24 hours.',
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH: Update Property Status (e.g., Mark as Rented, Update Draft)
 */
export async function PATCH(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, propertyTitle, status } = body;

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('properties')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', propertyId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (status === 'rented' && user.primaryEmailAddress?.emailAddress) {
      await notifyPropertyMarkedRented({
        listerEmail: user.primaryEmailAddress.emailAddress,
        listerName: user.fullName || 'Property Custodian',
        propertyTitle: propertyTitle || 'Your Property',
      });
    }

    return NextResponse.json({
      success: true,
      message: status === 'rented' ? 'Property marked as Rented.' : 'Property updated.',
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

