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

/**
 * 6. Gate Pass / Viewing Confirmed (Tenant Receives Pass Code & Custodian Details)
 */
export async function sendGatePassConfirmedEmail({
  tenantEmail,
  tenantName,
  propertyTitle,
  address,
  scheduledDate,
  timeSlot,
  custodianName,
  custodianPhone,
  passCode,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [tenantEmail],
      subject: `🎟️ Official Gate Pass: ${propertyTitle} [${passCode || 'RB-PASS'}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria
            </div>
          </div>

          <h2 style="color: #2D5A43; margin-bottom: 12px;">Your Inspection Gate Pass is Ready</h2>
          <p>Hello <strong>${tenantName}</strong>,</p>
          <p>The verified property custodian has confirmed your viewing appointment.</p>

          <div style="background-color: #EBF2ED; border: 2px dashed #2D5A43; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #2D5A43; margin: 0;">Compound Security Pass Code</p>
            <p style="font-size: 28px; font-weight: 800; color: #1E3F2F; margin: 8px 0; font-family: monospace;">${passCode || 'RB-' + Math.floor(1000 + Math.random() * 9000)}</p>
            <p style="font-size: 13px; color: #4B524D; margin: 0;">Show this pass at the compound gate or security post</p>
          </div>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #151816;">Appointment Details:</h4>
            <p style="margin: 6px 0;"><strong>Property:</strong> ${propertyTitle}</p>
            <p style="margin: 6px 0;"><strong>Address:</strong> ${address || 'Provided in your dashboard'}</p>
            <p style="margin: 6px 0;"><strong>Confirmed Date:</strong> ${scheduledDate}</p>
            <p style="margin: 6px 0;"><strong>Confirmed Time:</strong> ${timeSlot}</p>
            <p style="margin: 6px 0;"><strong>Verified Custodian:</strong> ${custodianName} (${custodianPhone})</p>
          </div>

          <div style="background-color: #FEF3C7; border: 1px solid #D97706; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 12px; color: #92400E;">
            <strong>⚠️ Zero-Tolerance Extortion Policy:</strong> Physical viewings are 100% free on RentBridge. Never pay money to security guards, caretakers, or agents.
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Gate pass email dispatch notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 7. Alternate Time Proposed (Custodian asks for a new slot)
 */
export async function sendAlternateTimeProposedEmail({
  tenantEmail,
  tenantName,
  propertyTitle,
  custodianName,
  originalDate,
  proposedDate,
  proposedSlot,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [tenantEmail],
      subject: `🔄 Proposed Alternate Viewing Time: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">Custodian Proposed an Alternate Slot</h2>
          <p>Hello <strong>${tenantName}</strong>,</p>
          <p>The custodian for <strong>${propertyTitle}</strong> is unavailable on <strong>${originalDate}</strong> and has proposed an alternative time:</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>New Proposed Date:</strong> ${proposedDate}</p>
            <p style="margin: 6px 0;"><strong>New Proposed Time:</strong> ${proposedSlot}</p>
            <p style="margin: 6px 0;"><strong>Custodian:</strong> ${custodianName}</p>
          </div>

          <p style="font-size: 14px;">Sign in to your RentBridge Tenant Dashboard to accept this new time or select a different viewing slot.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Alternate time email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 8. Listing Draft Expiring Warning (7-day or 24-hour reminder)
 */
export async function sendDraftExpiringWarningEmail({
  listerEmail,
  listerName,
  propertyTitle,
  daysRemaining,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [listerEmail],
      subject: `⏳ Listing Draft Expiring in ${daysRemaining} Days: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #D97706;">Action Needed on Unsubmitted Draft</h2>
          <p>Hello <strong>${listerName}</strong>,</p>
          <p>Your listing draft for <strong>${propertyTitle}</strong> has been inactive and will expire in <strong>${daysRemaining} days</strong>.</p>

          <div style="background-color: #FEF3C7; border: 1px solid #D97706; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; color: #92400E;">
            RentBridge automatically prunes 30-day uncompleted drafts to maintain verified real-time inventory for tenants in Lagos, Abuja, Port Harcourt, and Enugu.
          </div>

          <p style="font-size: 14px;">Log in to finish uploading your required verification photos and title document to publish your property for free.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Draft expiring email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 9. Property Marked as Rented
 */
export async function sendPropertyMarkedRentedEmail({
  listerEmail,
  listerName,
  propertyTitle,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [listerEmail],
      subject: `🎊 Rented: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">Congratulations on Your Successful Tenancy!</h2>
          <p>Hello <strong>${listerName}</strong>,</p>
          <p><strong>${propertyTitle}</strong> has been successfully marked as <strong>Rented</strong> and removed from the active public catalog.</p>

          <p style="font-size: 13px; color: #4B524D;">Thank you for partnering with RentBridge to provide 100% direct, agent-free real estate housing in Nigeria.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Marked rented email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 10. Account Blacklisted Alert
 */
export async function sendAccountBlacklistedEmail({
  userEmail,
  userName,
  reason,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [userEmail],
      subject: `🚨 Notice of Account Blacklist: RentBridge Nigeria`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FEF2F2; border: 1px solid #EF4444; border-radius: 16px;">
          <h2 style="color: #B91C1C;">Account Frozen & Blacklisted</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your RentBridge account and associated telephone number have been blacklisted following an anti-fraud investigation.</p>

          <div style="background-color: white; border: 1px solid #FCA5A5; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #7F1D1D;"><strong>Reason:</strong> ${reason || 'Violation of RentBridge Zero Inspection Fee Guarantee (Inspection fee / registration demand reported)'}</p>
          </div>

          <p style="font-size: 12px; color: #7F1D1D;">If you believe this action was taken in error, contact compliance@rentbridge.ng with your property ownership documentation.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Blacklist email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 11. Welcome Pack - Tenant
 */
export async function sendWelcomeTenantEmail({
  email,
  name,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [email],
      subject: `Welcome to RentBridge: Say Goodbye to Street Agents!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria
            </div>
          </div>

          <h2 style="color: #2D5A43;">Welcome, ${name || 'Prospective Tenant'}!</h2>
          <p>You have unlocked direct real estate access across Lagos, Abuja, Port Harcourt, and Enugu.</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #151816;">Your Tenant Privileges:</h4>
            <ul style="padding-left: 20px; font-size: 13px; color: #4B524D; line-height: 1.8;">
              <li><strong>₦0 Inspection Fees:</strong> Never pay transport or viewing fees to see any house.</li>
              <li><strong>0% Agent Commission:</strong> Deal directly with landlords, resident caretakers, and verified legal counsel.</li>
              <li><strong>Interactive Geo-Catalog:</strong> Explore neighborhoods with verified street and gate photos.</li>
            </ul>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Welcome tenant email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 12. Welcome Pack - Landlord / Caretaker / Lawyer
 */
export async function sendWelcomeCustodianEmail({
  email,
  name,
  role,
}) {
  const roleName = role === 'landlord' ? 'Landlord' : role === 'lawyer' ? 'Legal Counsel' : 'Resident Caretaker';
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [email],
      subject: `Welcome to RentBridge: List Direct, Zero Middlemen`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria
            </div>
          </div>

          <h2 style="color: #2D5A43;">Welcome, ${name || 'Property Custodian'}!</h2>
          <p>Your account is registered as a verified <strong>${roleName}</strong> on RentBridge.</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #151816;">Listing on RentBridge:</h4>
            <ul style="padding-left: 20px; font-size: 13px; color: #4B524D; line-height: 1.8;">
              <li><strong>Direct Matchmaking:</strong> Connect directly with qualified tenants without roadside middleman interference.</li>
              <li><strong>Phase 1 Verification:</strong> Upload 12+ transparency photos (residential) or 17+ (commercial) to earn the Verified Custodian badge.</li>
              <li><strong>Automated Gate Passes:</strong> Receive scheduled viewing requests and issue secure codes with 1 click.</li>
            </ul>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Welcome custodian email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 13. Appointment Locked Notice (Sent to Custodian with Tenant Details & Gate Pass)
 */
export async function sendAppointmentLockedEmail({
  custodianEmail,
  custodianName,
  propertyTitle,
  address,
  scheduledDate,
  timeSlot,
  tenantName,
  tenantPhone,
  passCode,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [custodianEmail],
      subject: `🔒 Appointment Locked In: ${propertyTitle} [Pass: ${passCode || 'RB-PASS'}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria
            </div>
          </div>

          <h2 style="color: #2D5A43; margin-bottom: 12px;">Viewing Appointment Locked</h2>
          <p>Hello <strong>${custodianName || 'Property Custodian'}</strong>,</p>
          <p>Your physical inspection for <strong>${propertyTitle}</strong> is locked into your schedule.</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>Confirmed Date:</strong> ${scheduledDate}</p>
            <p style="margin: 6px 0;"><strong>Time Slot:</strong> ${timeSlot}</p>
            <p style="margin: 6px 0;"><strong>Tenant Name:</strong> ${tenantName}</p>
            <p style="margin: 6px 0;"><strong>Tenant Phone:</strong> ${tenantPhone}</p>
            <p style="margin: 6px 0;"><strong>Compound Pass Code:</strong> <span style="font-family: monospace; font-weight: bold; color: #1E3F2F;">${passCode || 'RB-PASS'}</span></p>
          </div>

          <p style="font-size: 13px; color: #4B524D;">Please instruct compound security / gate men to permit entry when the tenant shows this pass code.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Appointment locked email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 14. Morning-of-Inspection Reminder (Sent at 8:00 AM on Viewing Day)
 */
export async function sendMorningInspectionReminderEmail({
  email,
  name,
  propertyTitle,
  address,
  scheduledDate,
  timeSlot,
  counterpartName,
  counterpartPhone,
  passCode,
  isTenant = true,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [email],
      subject: `⏰ Today: Physical Inspection for ${propertyTitle} at ${timeSlot}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">Good Morning, ${name}!</h2>
          <p>This is a quick reminder that your physical viewing is scheduled for <strong>today, ${scheduledDate} at ${timeSlot}</strong>.</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>Property:</strong> ${propertyTitle}</p>
            <p style="margin: 6px 0;"><strong>Location:</strong> ${address || 'Detailed address in dashboard'}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> ${timeSlot}</p>
            <p style="margin: 6px 0;"><strong>${isTenant ? 'Verified Custodian' : 'Prospective Tenant'}:</strong> ${counterpartName} (${counterpartPhone})</p>
            ${passCode ? `<p style="margin: 6px 0;"><strong>Gate Pass Code:</strong> <span style="font-family: monospace; font-weight: bold; color: #2D5A43;">${passCode}</span></p>` : ''}
          </div>

          ${isTenant ? `
            <div style="background-color: #FEF3C7; border: 1px solid #D97706; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 12px; color: #92400E;">
              <strong>⚠️ Zero Fee Guarantee:</strong> Physical viewings are strictly ₦0. If anyone requests gate or registration money, report them from your RentBridge dashboard for an instant listing freeze.
            </div>
          ` : `
            <p style="font-size: 13px; color: #4B524D;">Please ensure the property is accessible and compound security has been notified of the visitor.</p>
          `}
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Morning inspection reminder notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 15. Post-Inspection Compliance Check (Sent 3 hours after viewing to Tenant)
 */
export async function sendPostInspectionComplianceCheckEmail({
  tenantEmail,
  tenantName,
  propertyTitle,
  custodianName,
  inspectionId,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [tenantEmail],
      subject: `How was your inspection of ${propertyTitle}?`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">Viewing Integrity & Experience Check</h2>
          <p>Hello <strong>${tenantName}</strong>,</p>
          <p>You recently completed an inspection for <strong>${propertyTitle}</strong> with <strong>${custodianName}</strong>.</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="font-size: 15px; font-weight: bold; color: #151816; margin-bottom: 16px;">
              Were you asked by anyone to pay ANY inspection, gate, or registration fee?
            </p>
            <div style="display: inline-flex; gap: 12px;">
              <a href="https://rentbridge.ng/dashboard/inspections?feedback=clean&id=${inspectionId}" 
                 style="background-color: #2D5A43; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px;">
                ✅ No, 100% Free as Promised
              </a>
              <a href="https://rentbridge.ng/dashboard/inspections?feedback=extortion&id=${inspectionId}" 
                 style="background-color: #B91C1C; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px;">
                🚨 Yes, Money Was Demanded
              </a>
            </div>
          </div>

          <p style="font-size: 12px; color: #8F8372; text-align: center;">
            RentBridge relies on community verification to eliminate middleman extortion across Lagos, Abuja, Port Harcourt, and Enugu.
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Post-inspection compliance email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 16. Tenancy Agreement & Lease Receipt
 */
export async function sendTenancyAgreementReceiptEmail({
  recipientEmail,
  recipientName,
  counterpartName,
  propertyTitle,
  address,
  annualRent,
  cautionDeposit = 0,
  serviceCharge = 0,
  leaseStartDate,
  leaseEndDate,
  isLandlord = false,
}) {
  const totalPaid = Number(annualRent || 0) + Number(cautionDeposit || 0) + Number(serviceCharge || 0);
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [recipientEmail],
      subject: `📄 Tenancy Acknowledgment & Lease Receipt: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2D5A43; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              RentBridge Nigeria • Official Receipt
            </div>
          </div>

          <h2 style="color: #2D5A43; margin-bottom: 8px;">Tenancy Lease Acknowledgment</h2>
          <p>Hello <strong>${recipientName}</strong>,</p>
          <p>Here is your official lease record for <strong>${propertyTitle}</strong>, concluded with <strong>${counterpartName}</strong>.</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #151816; border-bottom: 1px solid #E8DFC8; padding-bottom: 8px;">Financial & Term Breakdown</h4>
            <p style="margin: 6px 0; display: flex; justify-content: space-between;"><span>Property:</span> <strong>${propertyTitle}</strong></p>
            <p style="margin: 6px 0; display: flex; justify-content: space-between;"><span>Address:</span> <strong>${address || 'Address on file'}</strong></p>
            <p style="margin: 6px 0; display: flex; justify-content: space-between;"><span>Annual Rent:</span> <strong>₦${Number(annualRent).toLocaleString()}</strong></p>
            <p style="margin: 6px 0; display: flex; justify-content: space-between;"><span>Caution Deposit:</span> <strong>₦${Number(cautionDeposit).toLocaleString()}</strong></p>
            <p style="margin: 6px 0; display: flex; justify-content: space-between;"><span>Service Charge:</span> <strong>₦${Number(serviceCharge).toLocaleString()}</strong></p>
            <p style="margin: 6px 0; display: flex; justify-content: space-between; color: #2D5A43; font-weight: bold;"><span>Agent Commission:</span> <span>₦0 (0% Zero Middleman)</span></p>
            <p style="margin: 12px 0 6px 0; border-top: 1px solid #E8DFC8; padding-top: 8px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #1E3F2F;">
              <span>Total Settlement:</span> <span>₦${totalPaid.toLocaleString()}</span>
            </p>
            <p style="margin: 6px 0; font-size: 12px; color: #4B524D;"><span>Lease Term:</span> <strong>${leaseStartDate || 'Start Date'} to ${leaseEndDate || 'End Date'}</strong></p>
          </div>

          <p style="font-size: 12px; color: #8F8372;">Saved under your RentBridge Legal Vault for immediate verification.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Tenancy receipt email notice:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 17. Annual Rent Renewal Reminder (60-day notice)
 */
export async function sendRentRenewalReminderEmail({
  email,
  name,
  propertyTitle,
  expiryDate,
  isLandlord = false,
  counterpartName,
  counterpartPhone,
}) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_SENDER,
      to: [email],
      subject: `🗓️ 60-Day Tenancy Renewal Notice: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #151816; background-color: #FBF9F5; border: 1px solid #E8DFC8; border-radius: 16px;">
          <h2 style="color: #2D5A43;">Tenancy Renewal Notice</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>The tenancy term for <strong>${propertyTitle}</strong> is scheduled to conclude on <strong>${expiryDate}</strong> (approx. 60 days remaining).</p>

          <div style="background-color: white; border: 1px solid #E2D7C8; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>${isLandlord ? 'Tenant' : 'Landlord / Custodian'}:</strong> ${counterpartName}</p>
            <p style="margin: 6px 0;"><strong>Telephone:</strong> ${counterpartPhone}</p>
            <p style="margin: 6px 0;"><strong>Lease Expiry Date:</strong> ${expiryDate}</p>
          </div>

          <p style="font-size: 13px; color: #4B524D;">
            We advise initiating lease renewal discussions early. As always on RentBridge, renewal agreements carry <strong>0% agent fee and ₦0 agreement extortion</strong>.
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.warn('[Resend] Rent renewal reminder notice:', error.message);
    return { success: false, error: error.message };
  }
}



