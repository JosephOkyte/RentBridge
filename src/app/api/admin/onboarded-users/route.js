import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

const SPREADSHEET_ID = '1hMl2nUdVWctK5jIrr55FOlSwpsqKbE94aeTaC8zV0pE';
const SHEET_NAMES = ['Landlord', 'Caretaker', 'Lawyers', 'Tenants'];

function normalizePhone(val) {
  if (!val) return { raw: '', formatted: 'N/A', dial: '' };
  let str = String(val).trim();
  if (str.includes('E') || str.includes('e')) {
    const num = Number(str);
    if (!isNaN(num)) str = num.toFixed(0);
  }
  const digits = str.replace(/\D/g, '');
  if (!digits) return { raw: str, formatted: str, dial: str };

  if (digits.length === 10) {
    return {
      raw: str,
      formatted: `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`,
      dial: `+234${digits}`
    };
  } else if (digits.length === 11 && digits.startsWith('0')) {
    const core = digits.slice(1);
    return {
      raw: str,
      formatted: `+234 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6)}`,
      dial: `+234${core}`
    };
  } else if (digits.length === 13 && digits.startsWith('234')) {
    const core = digits.slice(3);
    return {
      raw: str,
      formatted: `+234 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6)}`,
      dial: `+234${core}`
    };
  }
  return { raw: str, formatted: str, dial: digits ? `+${digits}` : str };
}

function parseCustomTimestamp(tsStr) {
  if (!tsStr) return { display: 'Recent', iso: new Date().toISOString() };
  try {
    // Format: "14:31:28 | 14/11/2026" or "03:48:00 | 16/11/2026"
    const parts = tsStr.split('|').map(s => s.trim());
    if (parts.length === 2) {
      const timePart = parts[0]; // "14:31:28"
      const datePart = parts[1]; // "14/11/2026"
      const [day, month, year] = datePart.split('/').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);
      const d = new Date(year, month - 1, day, hour, minute, second || 0);
      return {
        display: `${datePart} ${timePart}`,
        iso: !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString()
      };
    }
    const d = new Date(tsStr);
    return {
      display: tsStr,
      iso: !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString()
    };
  } catch {
    return { display: tsStr, iso: new Date().toISOString() };
  }
}

async function fetchSheetData(sheetName) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const res = await fetch(url, {
      next: { revalidate: 30 }, // Cache for 30s
      headers: {
        'User-Agent': 'RentBridge-Citadel-Monitor/2.0'
      }
    });

    if (!res.ok) {
      throw new Error(`Google Sheets responded with HTTP ${res.status}`);
    }

    const text = await res.text();
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonStr);

    const rows = parsed.table?.rows || [];
    return rows.map((r, idx) => {
      const c = r.c || [];
      const rawTimestamp = c[0]?.v ? String(c[0].v) : '';
      const fullName = c[1]?.v ? String(c[1].v).trim() : 'Anonymous';
      const email = c[2]?.v ? String(c[2].v).trim() : '';
      const rawPhoneVal = c[3]?.v !== undefined && c[3]?.v !== null ? c[3].v : '';
      const category = c[4]?.v ? String(c[4].v).trim() : sheetName;
      const note = c[5]?.v ? String(c[5].v).trim() : '';

      const phoneInfo = normalizePhone(rawPhoneVal);
      const timeInfo = parseCustomTimestamp(rawTimestamp);

      return {
        id: `${sheetName.toLowerCase()}-${idx}-${rawTimestamp.replace(/\D/g, '')}`,
        sheetSource: sheetName,
        timestampRaw: rawTimestamp,
        timestampDisplay: timeInfo.display,
        submittedAt: timeInfo.iso,
        fullName,
        email,
        phoneRaw: phoneInfo.raw,
        phoneFormatted: phoneInfo.formatted,
        phoneDial: phoneInfo.dial,
        category,
        note
      };
    });
  } catch (err) {
    console.error(`[Admin Google Sheet Fetch Error - ${sheetName}]:`, err.message);
    return [];
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    // Role-based Access Control Check
    const email = user.primaryEmailAddress?.emailAddress || '';
    const isClerkAdmin = user.publicMetadata?.role === 'admin';
    const isAdminEmail = email.endsWith('@rentbridge.ng') || email === 'admin@rentbridge.ng' || email === 'josephokyte@gmail.com';

    let isAdmin = isClerkAdmin || isAdminEmail;

    if (!isAdmin) {
      try {
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('profiles')
          .select('role')
          .eq('clerk_id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          isAdmin = true;
        }
      } catch (e) {
        console.warn('Profile role check fallback error:', e);
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required to access user database.' }, { status: 403 });
    }

    // Fetch all 4 Google Sheets in parallel + Supabase profiles fallback
    const [landlords, caretakers, lawyers, tenants, supabaseProfiles] = await Promise.all([
      fetchSheetData('Landlord'),
      fetchSheetData('Caretaker'),
      fetchSheetData('Lawyers'),
      fetchSheetData('Tenants'),
      (async () => {
        try {
          const adminClient = createAdminClient();
          const { data } = await adminClient
            .from('profiles')
            .select('id, email, full_name, phone, role, created_at, updated_at')
            .in('role', ['landlord', 'caretaker', 'lawyer', 'tenant']);
          return data || [];
        } catch (err) {
          console.warn('[Onboarded Users Supabase fallback error]:', err.message);
          return [];
        }
      })(),
    ]);

    const existingEmails = new Set(
      [...landlords, ...caretakers, ...lawyers, ...tenants]
        .map((r) => (r.email || '').toLowerCase().trim())
        .filter(Boolean)
    );

    const roleToSheet = {
      landlord: { list: landlords, label: 'Landlord' },
      caretaker: { list: caretakers, label: 'Caretaker' },
      lawyer: { list: lawyers, label: 'Lawyers' },
      tenant: { list: tenants, label: 'Tenants' },
    };

    for (const prof of supabaseProfiles) {
      const emailLower = (prof.email || '').toLowerCase().trim();
      if (!emailLower || existingEmails.has(emailLower)) continue;
      existingEmails.add(emailLower);

      const target = roleToSheet[prof.role] || roleToSheet.tenant;
      const phoneInfo = normalizePhone(prof.phone || '');
      const isoDate = prof.updated_at || prof.created_at || new Date().toISOString();
      const d = new Date(isoDate);
      const displayDate = !isNaN(d.getTime())
        ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        : 'Recent';

      target.list.push({
        id: `sb-${prof.id}`,
        sheetSource: target.label,
        timestampRaw: isoDate,
        timestampDisplay: displayDate,
        submittedAt: isoDate,
        fullName: prof.full_name || 'Verified User',
        email: prof.email || '',
        phoneRaw: phoneInfo.raw,
        phoneFormatted: phoneInfo.formatted,
        phoneDial: phoneInfo.dial,
        category: prof.role ? prof.role.charAt(0).toUpperCase() + prof.role.slice(1) : 'Tenant',
        note: 'Verified Direct Intake (Synced via RentBridge Portal)',
      });
    }

    const all = [...landlords, ...caretakers, ...lawyers, ...tenants].sort((a, b) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    const now = new Date();
    const isToday = (isoDate) => {
      const d = new Date(isoDate);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    };

    const stats = {
      total: all.length,
      landlordsCount: landlords.length,
      caretakersCount: caretakers.length,
      lawyersCount: lawyers.length,
      tenantsCount: tenants.length,
      todayCount: all.filter(item => isToday(item.submittedAt)).length,
      lastSynced: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      stats,
      sheets: {
        all,
        landlord: landlords,
        caretaker: caretakers,
        lawyers: lawyers,
        tenants: tenants
      },
      sheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?usp=sharing`
    });
  } catch (error) {
    console.error('[Admin Onboarded Users Database API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
