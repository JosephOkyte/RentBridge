import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import {
  notifyMorningInspectionReminder,
  notifyPostInspectionComplianceCheck,
  notifyDraftExpiring,
  notifyRentRenewal,
} from '../../../../lib/notifications';

/**
 * GET or POST /api/notifications/reminders
 * Automated runner for daily reminders:
 * 1. Morning viewing alerts (8:00 AM)
 * 2. Post-viewing compliance checks (Did anyone demand fees?)
 * 3. 30-Day draft expiration warnings
 * 4. 60-Day tenancy renewal notices
 */
export async function GET(request) {
  return handleReminders(request);
}

export async function POST(request) {
  return handleReminders(request);
}

async function handleReminders(request) {
  try {
    const adminClient = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];
    const summary = {
      morningRemindersSent: 0,
      postInspectionChecksSent: 0,
      draftWarningsSent: 0,
      renewalNoticesSent: 0,
    };

    // 1. Morning Inspection Reminders (Scheduled for Today)
    try {
      const { data: todayInspections } = await adminClient
        .from('inspections')
        .select('*')
        .eq('scheduled_at', todayStr)
        .eq('status', 'confirmed');

      if (todayInspections && todayInspections.length > 0) {
        for (const insp of todayInspections) {
          // Send to tenant
          await notifyMorningInspectionReminder({
            email: insp.tenant_email,
            phone: insp.tenant_phone,
            name: insp.tenant_name,
            propertyTitle: insp.property_title,
            address: insp.property_address,
            scheduledDate: insp.scheduled_at,
            timeSlot: insp.time_slot,
            counterpartName: insp.lister_name,
            counterpartPhone: insp.lister_phone,
            passCode: insp.pass_code,
            isTenant: true,
          });

          // Send to custodian
          await notifyMorningInspectionReminder({
            email: insp.lister_email,
            phone: insp.lister_phone,
            name: insp.lister_name,
            propertyTitle: insp.property_title,
            address: insp.property_address,
            scheduledDate: insp.scheduled_at,
            timeSlot: insp.time_slot,
            counterpartName: insp.tenant_name,
            counterpartPhone: insp.tenant_phone,
            passCode: insp.pass_code,
            isTenant: false,
          });

          summary.morningRemindersSent += 1;
        }
      }
    } catch (err) {
      console.warn('[Reminders] Morning inspection error:', err.message);
    }

    // 2. Post-Inspection Compliance Checks (for yesterday's viewings)
    try {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const { data: pastInspections } = await adminClient
        .from('inspections')
        .select('*')
        .eq('scheduled_at', yesterday)
        .eq('status', 'confirmed')
        .eq('fee_extortion_reported', false);

      if (pastInspections && pastInspections.length > 0) {
        for (const insp of pastInspections) {
          await notifyPostInspectionComplianceCheck({
            tenantEmail: insp.tenant_email,
            tenantPhone: insp.tenant_phone,
            tenantName: insp.tenant_name,
            propertyTitle: insp.property_title,
            custodianName: insp.lister_name,
            inspectionId: insp.id,
          });
          summary.postInspectionChecksSent += 1;
        }
      }
    } catch (err) {
      console.warn('[Reminders] Post-inspection compliance error:', err.message);
    }

    // 3. 30-Day Draft Expiration Warning (for drafts created 23+ days ago)
    try {
      const twentyThreeDaysAgo = new Date(Date.now() - 23 * 86400000).toISOString();
      const { data: expiringDrafts } = await adminClient
        .from('properties')
        .select('*')
        .eq('status', 'draft')
        .lte('created_at', twentyThreeDaysAgo);

      if (expiringDrafts && expiringDrafts.length > 0) {
        for (const draft of expiringDrafts) {
          const daysOld = Math.floor((Date.now() - new Date(draft.created_at).getTime()) / 86400000);
          const daysRemaining = Math.max(1, 30 - daysOld);
          await notifyDraftExpiring({
            listerEmail: draft.lister_email,
            listerName: draft.lister_name,
            listerPhone: draft.lister_phone,
            propertyTitle: draft.title,
            daysRemaining,
          });
          summary.draftWarningsSent += 1;
        }
      }
    } catch (err) {
      console.warn('[Reminders] Draft expiration error:', err.message);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

