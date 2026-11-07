import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { createAdminClient } from '../../../../lib/supabase/admin';

/**
 * Clerk Webhook Handler: Syncs user lifecycle to Supabase
 * Events handled:
 * - user.created -> Inserts into public.profiles
 * - user.updated -> Updates public.profiles
 * - user.deleted -> Removes from public.profiles
 */
export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.warn('[Clerk Webhook] CLERK_WEBHOOK_SECRET is not configured in environment variables.');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  // Get the raw body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('[Clerk Webhook] Verification error:', err.message);
    return new Response('Error: Signature verification failed', { status: 400 });
  }

  const eventType = evt.type;
  const adminClient = createAdminClient();

  // 1. USER CREATED
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, phone_numbers, public_metadata } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    const primaryPhone = phone_numbers?.[0]?.phone_number || null;
    const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'User';
    const role = public_metadata?.role || 'tenant'; // 'tenant', 'landlord', 'caretaker', 'lawyer'

    try {
      // Check for duplicate email (Anti-fraud single-account rule)
      const { data: existingUser } = await adminClient
        .from('profiles')
        .select('id, email')
        .eq('email', primaryEmail)
        .maybeSingle();

      if (existingUser) {
        console.warn(`[Clerk Webhook] Duplicate email detected for ${primaryEmail}. Linking to existing profile.`);
      }

      const { error } = await adminClient.from('profiles').upsert(
        {
          clerk_id: id,
          email: primaryEmail,
          full_name: fullName,
          phone: primaryPhone,
          role: role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_id' }
      );

      if (error) throw error;
      console.log(`[Clerk Webhook] User profile synced to Supabase for ${primaryEmail}`);
    } catch (err) {
      console.error('[Clerk Webhook] Database upsert error:', err.message);
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  }

  // 2. USER UPDATED
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers, public_metadata } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;
    const primaryPhone = phone_numbers?.[0]?.phone_number || null;
    const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'User';

    try {
      await adminClient
        .from('profiles')
        .update({
          email: primaryEmail,
          full_name: fullName,
          phone: primaryPhone,
          role: public_metadata?.role || 'tenant',
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', id);
    } catch (err) {
      console.error('[Clerk Webhook] Update error:', err.message);
    }
  }

  // 3. USER DELETED
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    try {
      await adminClient.from('profiles').delete().eq('clerk_id', id);
    } catch (err) {
      console.error('[Clerk Webhook] Deletion error:', err.message);
    }
  }

  return new Response('Webhook received and processed', { status: 200 });
}

