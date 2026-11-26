import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from '../../../lib/supabase/admin';

const N8N_FORM_URL =
  process.env.NEXT_PUBLIC_N8N_ONBOARDING_FORM_URL ||
  'https://prime-tech-hub.duckdns.org/form/b40e282e-fe38-483a-84b0-6e120508da81';

const CATEGORY_TO_ROLE = {
  Landlord: 'landlord',
  Caretaker: 'caretaker',
  Lawyer: 'lawyer',
  Tenant: 'tenant',
};

/**
 * POST /api/onboarding
 * Submits user onboarding intake server-side to:
 * 1. Supabase `profiles` table (primary source of truth)
 * 2. n8n Form Trigger (server-to-server, bypassing browser CSP sandbox / CORS blocks)
 */
export async function POST(request) {
  try {
    const user = await currentUser();
    const body = await request.json();

    const firstName = (body.firstName || '').trim();
    const lastName = (body.lastName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();
    const category = (body.category || '').trim();
    const note = (body.note || '').trim();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First Name and Last Name are required.' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please provide a valid 11-digit Nigerian phone number (e.g. 0803 123 4567 or +234 803 123 4567).' },
        { status: 400 }
      );
    }

    const mappedRole = CATEGORY_TO_ROLE[category] || 'tenant';
    const fullName = `${firstName} ${lastName}`.trim();

    // 1. Persist to Supabase `profiles`
    let savedProfile = null;
    try {
      const adminClient = createAdminClient();
      if (user?.id) {
        const { data: existing } = await adminClient
          .from('profiles')
          .select('id, role')
          .eq('clerk_id', user.id)
          .maybeSingle();

        const effectiveRole = existing?.role === 'admin' ? 'admin' : mappedRole;

        const { data: upserted, error: upsertErr } = await adminClient
          .from('profiles')
          .upsert(
            {
              clerk_id: user.id,
              email,
              full_name: fullName,
              phone: cleanPhone,
              whatsapp: cleanPhone,
              role: effectiveRole,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'clerk_id' }
          )
          .select()
          .maybeSingle();

        if (upsertErr) {
          console.warn('[Onboarding Supabase upsert warning]:', upsertErr.message);
        } else {
          savedProfile = upserted;
        }
      }
    } catch (dbErr) {
      console.warn('[Onboarding Supabase fallback warning]:', dbErr.message);
    }

    // 2. Forward server-to-server to n8n Form Trigger (bypasses browser CSP sandbox CORS error)
    let n8nSynced = false;
    let n8nStatus = null;

    try {
      const formData = new FormData();
      formData.append('field-0', firstName);
      formData.append('field-1', lastName);
      formData.append('field-2', email);
      formData.append('field-3', cleanPhone);
      formData.append('field-4', category || 'Tenant');
      formData.append('field-5', note);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const n8nRes = await fetch(N8N_FORM_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      n8nStatus = n8nRes.status;
      n8nSynced = n8nRes.ok;

      if (!n8nRes.ok) {
        console.warn(`[Onboarding n8n forward warning] HTTP ${n8nRes.status}`);
      }
    } catch (n8nErr) {
      console.warn('[Onboarding n8n forward error]:', n8nErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding registration completed successfully.',
      profile: savedProfile,
      role: mappedRole,
      n8nSynced,
      n8nStatus,
    });
  } catch (err) {
    console.error('[Onboarding API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process onboarding registration.' },
      { status: 500 }
    );
  }
}
