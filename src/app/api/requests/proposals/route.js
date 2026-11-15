import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '../../../../lib/supabase/server';
import { updateInMemoryRequestProposals } from '../../../../data/requests';

// Store in-memory runtime proposals
let inMemoryProposals = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const landlordId = searchParams.get('landlordId');

    try {
      const supabase = await createClient();
      let query = supabase.from('property_request_proposals').select('*');
      if (requestId) query = query.eq('request_id', requestId);
      if (landlordId) query = query.eq('landlord_id', landlordId);

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ proposals: data });
      }
    } catch (err) {
      console.warn('Supabase proposal fetch fallback:', err.message);
    }

    let filtered = inMemoryProposals;
    if (requestId) filtered = filtered.filter(p => p.requestId === requestId);
    if (landlordId) filtered = filtered.filter(p => p.landlordId === landlordId);

    return NextResponse.json({ proposals: filtered });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    const body = await request.json();

    const {
      requestId,
      ticketId,
      propertyId,
      propertyTitle,
      propertyCity,
      propertyPrice,
      message,
      inspectionPassOffered,
    } = body;

    if (!requestId && !ticketId) {
      return NextResponse.json({ error: 'Missing request or ticket reference.' }, { status: 400 });
    }

    if (!propertyTitle) {
      return NextResponse.json({ error: 'Please select a verified property to propose.' }, { status: 400 });
    }

    const gatePassCode = inspectionPassOffered 
      ? `PASS-PROP-${Math.floor(100000 + Math.random() * 900000)}` 
      : null;

    const newProposal = {
      id: `prop-${Date.now()}`,
      requestId,
      ticketId,
      landlordId: user?.id || 'demo-landlord',
      landlordName: user?.fullName || user?.firstName || 'Verified Custodian',
      landlordRole: 'Verified Landlord',
      propertyId: propertyId || 'prop-custom',
      propertyTitle,
      propertyCity: propertyCity || 'Lagos',
      propertyPrice: Number(propertyPrice) || 0,
      message: message?.trim() || 'I have a verified property matching your exact requirements with ₦0 agent fees.',
      inspectionPassOffered: Boolean(inspectionPassOffered),
      gatePassCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Attempt Supabase insert
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('property_request_proposals')
        .insert({
          request_id: newProposal.requestId,
          landlord_id: newProposal.landlordId,
          landlord_name: newProposal.landlordName,
          landlord_role: newProposal.landlordRole,
          property_id: newProposal.propertyId,
          property_title: newProposal.propertyTitle,
          property_city: newProposal.propertyCity,
          property_price: newProposal.propertyPrice,
          message: newProposal.message,
          inspection_pass_offered: newProposal.inspectionPassOffered,
          gate_pass_code: newProposal.gatePassCode,
          status: 'pending',
        })
        .select()
        .single();

      if (!error && data) {
        updateInMemoryRequestProposals(requestId || ticketId);
        inMemoryProposals = [newProposal, ...inMemoryProposals];
        return NextResponse.json({ success: true, proposal: data }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn('Supabase proposal insert warning, fallback to memory:', dbErr.message);
    }

    // Fallback store
    inMemoryProposals = [newProposal, ...inMemoryProposals];
    updateInMemoryRequestProposals(requestId || ticketId);

    return NextResponse.json({
      success: true,
      proposal: newProposal
    }, { status: 201 });
  } catch (err) {
    console.error('Proposal POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

