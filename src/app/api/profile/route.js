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
    const isAdminEmail = email.endsWith('@rentbridge.ng') || email === 'admin@rentbridge.ng' || email === 'josephokyte@gmail.com';
    const isSuperAdmin = isClerkAdmin || isAdminEmail || profile?.role === 'admin';

    let finalProfile = profile;
    if (isSuperAdmin) {
      if (!profile) {
        const { data: createdAdmin } = await adminClient
          .from('profiles')
          .upsert({
            clerk_id: user.id,
            email,
            full_name: user.fullName || 'Super Admin',
            role: 'admin',
            is_verified: true,
            city_hub: 'lagos',
          })
          .select()
          .maybeSingle();
        finalProfile = createdAdmin || { role: 'admin', is_verified: true, email, full_name: user.fullName || 'Admin' };
      } else {
        finalProfile = { ...profile, role: 'admin' };
      }
    }

    const userImage = user.imageUrl || profile?.avatar_url || '';
    const finalProfileWithImage = finalProfile ? {
      ...finalProfile,
      avatar_url: profile?.avatar_url || userImage,
    } : null;

    return NextResponse.json({
      user: {
        id: user.id,
        email,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Verified User',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
        imageUrl: userImage,
      },
      profile: finalProfileWithImage,
      isAdmin: isSuperAdmin,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/profile
 * Update user personal photo (avatar_url), phone, whatsapp.
 */
export async function PATCH(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatar_url, phone, whatsapp, full_name } = body;

    const adminClient = createAdminClient();
    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (phone !== undefined) updates.phone = phone;
    if (whatsapp !== undefined) updates.whatsapp = whatsapp;
    if (full_name !== undefined) updates.full_name = full_name;

    const { data: updated, error } = await adminClient
      .from('profiles')
      .update(updates)
      .eq('clerk_id', user.id)
      .select()
      .maybeSingle();

    if (error) {
      // If column avatar_url doesn't exist in Supabase table yet, retry gracefully
      if (error.message && error.message.includes('avatar_url')) {
        delete updates.avatar_url;
        const { data: fallbackUpdated } = await adminClient
          .from('profiles')
          .update(updates)
          .eq('clerk_id', user.id)
          .select()
          .maybeSingle();
        return NextResponse.json({ success: true, profile: fallbackUpdated });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: updated });
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

