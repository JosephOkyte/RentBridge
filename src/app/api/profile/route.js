import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from '../../../lib/supabase/admin';

/**
 * GET /api/profile
 * Retrieves the authenticated user's profile and assigned role.
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('*')
      .eq('clerk_id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[Profile fetch warning]:', error.message);
    }

    const email = user.primaryEmailAddress?.emailAddress || '';
    const isClerkAdmin = user.publicMetadata?.role === 'admin';
    const isAdminEmail = email.endsWith('@rentbridge.ng') || email === 'admin@rentbridge.ng';
    const isSuperAdmin = isClerkAdmin || isAdminEmail || profile?.role === 'admin';

    const finalProfile = profile 
      ? { ...profile, role: isSuperAdmin ? 'admin' : profile.role } 
      : (isSuperAdmin ? { role: 'admin', is_verified: true, email, full_name: user.fullName || 'Admin' } : null);

    return NextResponse.json({
      user: {
        id: user.id,
        email,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Verified User',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
      },
      profile: finalProfile,
      isAdmin: isSuperAdmin,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/profile
 * Initial registration / role lock.
 * Strict rule: Role switching is forbidden once chosen.
 */
export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, phone, whatsapp, city_hub } = body;

    const validRoles = ['tenant', 'landlord', 'caretaker', 'lawyer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid account role selected.' }, { status: 400 });
    }

    const email = user.primaryEmailAddress?.emailAddress || '';
    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Verified User';

    const adminClient = createAdminClient();

    // Check if profile already exists (strict rule: no role switching once set)
    const { data: existing } = await adminClient
      .from('profiles')
      .select('*')
      .eq('clerk_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: `Your account is already registered as a ${existing.role.toUpperCase()}. To maintain 100% data integrity and zero-agent purity, role switching is disabled. If you wish to use another role, please sign in with your separate ${role} account.`,
        },
        { status: 400 }
      );
    }

    const newProfile = {
      clerk_id: user.id,
      email,
      full_name: fullName,
      phone: phone || user.primaryPhoneNumber?.phoneNumber || '',
      whatsapp: whatsapp || '',
      role,
      is_verified: role === 'tenant', // Tenants are auto-verified on email; listers verified via deed audits
      city_hub: city_hub || 'lagos',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await adminClient
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: inserted });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

