import { resend, EMAIL_SENDER } from './client';

/**
 * 1. Email to Lister when property is submitted for verification
 */
export async function sendPropertySubmittedEmail({ listerEmail, listerName, propertyTitle, photoCount }) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [listerEmail],
      subject: `Property Verification in Progress: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria
            </div>
            <p style="color: #8F8372; font-size: 12px; margin-top: 4px;">Direct Real Estate • ₦0 Viewing Fees • Zero Street Agents</p>
          </div>

          <h2 style="color: #2D5A43; margin-bottom: 12px;">Verification Request Received</h2>
          <p>Hello <strong>${listerName || 'Property Custodian'}</strong>,</p>
          <p>Thank you for submitting <strong>${propertyTitle}</strong> along with your <strong>${photoCount} verification photos</strong>.</p>
          
          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #151816;">Phase 1 Verification Protocol:</h4>
            <ul style="padding-left: 20px; font-size: 13px; color: #4B524D; line-height: 1.6;">
              <li>Our verification officer is reviewing your street road photos, compound gate entrance, and interior walkthrough.</li>
              <li>Your land title credentials (C of O / Deed / Power of Custody) are being cross-referenced.</li>
              <li>Expect a brief verification phone call from our compliance desk within 24 hours.</li>
            </ul>
          </div>

          <p style="font-size: 12px; color: #8F8372;">RentBridge anti-fraud policy strictly guarantees direct custodian listings only. Your property remains hidden from public searches until verified.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Property submitted email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Email to Lister when Admin Approves Listing (Goes Live)
 */
export async function sendPropertyApprovedEmail({ listerEmail, listerName, propertyTitle, city }) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [listerEmail],
      subject: `🎉 Approved & Live: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria
            </div>
          </div>

          <h2 style="color: #2D5A43; margin-bottom: 12px;">Congratulations! Your Property is 100% Verified</h2>
          <p>Hello <strong>${listerName}</strong>,</p>
          <p>Your listing <strong>${propertyTitle}</strong> in <strong>${city}</strong> has passed our title deed audit and photo transparency check.</p>
          
          <div style="background-color: #EBF2ED; border: 1px solid #2D5A43; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="font-weight: bold; color: #1E3F2F; margin: 0 0 6px 0;">Verified Custodian Badge Awarded</p>
            <p style="font-size: 13px; color: #2D5A43; margin: 0;">Your listing is now publicly visible on the interactive Google Map and property catalog with 0% agent commission guaranteed.</p>
          </div>

          <p style="font-size: 13px;">Prospective tenants can now book 100% free physical inspections through your dashboard.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Property approved email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 3. Email to Lister when Admin Requests Revisions (e.g. Blurry street photos)
 */
export async function sendRevisionRequestedEmail({ listerEmail, listerName, propertyTitle, feedbackNotes }) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [listerEmail],
      subject: `Action Required on Listing: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #B45309; margin-bottom: 12px;">Action Needed to Complete Verification</h2>
          <p>Hello <strong>${listerName}</strong>,</p>
          <p>Our compliance officer reviewed your submission for <strong>${propertyTitle}</strong> and requested the following update before your listing can go live:</p>
          
          <div style="background-color: white; border: 1px solid #D97706; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="font-weight: bold; color: #B45309; margin: 0 0 6px 0;">Officer Notes:</p>
            <p style="font-size: 14px; color: #151816; margin: 0;">${feedbackNotes}</p>
          </div>

          <p style="font-size: 13px; color: #4B524D;">Please sign in to your RentBridge Lister Dashboard to edit your listing draft and submit the updated photos or documents.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Revision requested email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 4. Dual Emails when a Free Inspection is Booked (Tenant + Lister)
 */
export async function sendInspectionBookedEmails({
  tenantEmail,
  tenantName,
  tenantPhone,
  listerEmail,
  listerName,
  listerPhone,
  propertyTitle,
  scheduledDate,
  timeSlot,
}) {
  try {
    // A. Confirmation to Tenant
    const tenantMail = resend.emails.send({
      from: EMAIL_SENDER,
      to: [tenantEmail],
      subject: `Inspection Scheduled: ${propertyTitle} (₦0 Viewing Fee Guaranteed)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">Your Free Physical Viewing is Booked</h2>
          <p>Hello <strong>${tenantName}</strong>,</p>
          <p>Your inspection for <strong>${propertyTitle}</strong> has been transmitted directly to the verified custodian.</p>
          
          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Preferred Date:</strong> ${scheduledDate}</p>
            <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${timeSlot}</p>
            <p style="margin: 4px 0;"><strong>Verified Lister:</strong> ${listerName} (${listerPhone})</p>
          </div>

          <div style="background-color: #FEF3C7; border: 1px solid #D97706; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 12px; color: #92400E;">
            <strong>⚠️ Zero Inspection Fee Guarantee:</strong> Never pay transport money, "gate pass", or registration fees to view this house. If anyone demands cash, report them immediately from your dashboard for instant platform blacklisting.
          </div>
        </div>
      `,
    });

    // B. Alert to Lister
    const listerMail = resend.emails.send({
      from: EMAIL_SENDER,
      to: [listerEmail],
      subject: `New Free Inspection Request: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">New Tenant Viewing Request</h2>
          <p>Hello <strong>${listerName}</strong>,</p>
          <p>A prospective tenant has requested to inspect <strong>${propertyTitle}</strong>.</p>
          
          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Tenant Name:</strong> ${tenantName}</p>
            <p style="margin: 4px 0;"><strong>Tenant Telephone:</strong> ${tenantPhone}</p>
            <p style="margin: 4px 0;"><strong>Requested Date:</strong> ${scheduledDate} at ${timeSlot}</p>
          </div>

          <p style="font-size: 13px;">Please reach out to the tenant to confirm compound security clearance and directions.</p>
        </div>
      `,
    });

    await Promise.allSettled([tenantMail, listerMail]);
    return { success: true };
  } catch (error) {
    console.warn('[Resend] Inspection email dispatch notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 5. Instant Alert to Super Admin on Fee Extortion Flag
 */
export async function sendFraudReportAlertEmail({ adminEmail, propertyTitle, listerName, tenantName, reportNotes }) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [adminEmail || 'admin@rentbridge.ng'],
      subject: `🚨 URGENT: Fee Extortion Reported on ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FEF2F2; border: 1px solid #EF4444; border-radius: 16px;">
          <h2 style="color: #B91C1C;">🚨 Fraud & Fee Extortion Incident Flagged</h2>
          <p>A prospective tenant reported an inspection fee demand, violating RentBridge zero-agent policy.</p>
          
          <div style="background-color: white; border: 1px solid #FCA5A5; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Property:</strong> ${propertyTitle}</p>
            <p style="margin: 4px 0;"><strong>Accused Lister:</strong> ${listerName}</p>
            <p style="margin: 4px 0;"><strong>Reporting Tenant:</strong> ${tenantName}</p>
            <p style="margin: 4px 0;"><strong>Tenant Complaint:</strong> ${reportNotes}</p>
          </div>

          <p style="font-size: 13px; color: #7F1D1D; font-weight: bold;">Action: Open the Admin Fraud Desk to freeze this listing and blacklist the associated telephone number.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Fraud report alert notice:', error.message);
    return { success: false, error: error.message };
  }
}

