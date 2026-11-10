/**
 * RentBridge Nigeria - WhatsApp Notification & Deep-Link Utility
 * 
 * Supports:
 * 1. Direct 1-click wa.me URLs for peer-to-peer mobile & web WhatsApp chat.
 * 2. Automated dispatch via Termii API or Meta WhatsApp Cloud API (when API keys are provided).
 * 3. Graceful fallback console logger for development & offline environments.
 */

/**
 * Normalizes any Nigerian telephone format (e.g. "0803 123 4567", "+2348031234567", "2348031234567")
 * into international format without symbols (e.g. "2348031234567").
 */
export function normalizeNigerianPhone(phone) {
  if (!phone) return '';
  const digitsOnly = String(phone).replace(/[^\d]/g, '');
  
  if (digitsOnly.startsWith('234') && digitsOnly.length === 13) {
    return digitsOnly;
  }
  if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
    return '234' + digitsOnly.slice(1);
  }
  if (digitsOnly.length === 10) {
    return '234' + digitsOnly;
  }
  return digitsOnly;
}

/**
 * Generates a direct 1-click wa.me link with encoded pre-filled text.
 */
export function buildWhatsAppDeepLink(phone, message) {
  const normalized = normalizeNigerianPhone(phone);
  if (!normalized) return '#';
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Automated WhatsApp message sender.
 * Tries Termii (Nigerian SMS/WhatsApp Gateway) or WhatsApp Cloud API.
 * Falls back gracefully to console log if no keys are present.
 */
export async function sendWhatsAppMessage({ phone, message }) {
  const normalizedPhone = normalizeNigerianPhone(phone);
  if (!normalizedPhone) {
    return { success: false, error: 'Invalid phone number' };
  }

  // 1. Termii Gateway (Popular in Nigeria)
  const termiiKey = process.env.TERMII_API_KEY;
  if (termiiKey) {
    try {
      const res = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: normalizedPhone,
          from: process.env.TERMII_SENDER_ID || 'RentBridge',
          sms: message,
          type: 'plain',
          channel: 'whatsapp',
          api_key: termiiKey,
        }),
      });
      const data = await res.json();
      return { success: true, provider: 'termii', data };
    } catch (err) {
      console.warn('[WhatsApp] Termii dispatch warning:', err.message);
    }
  }

  // 2. Meta WhatsApp Cloud API
  const waToken = process.env.WHATSAPP_API_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (waToken && waPhoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${waPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${waToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizedPhone,
          type: 'text',
          text: { body: message },
        }),
      });
      const data = await res.json();
      return { success: true, provider: 'meta', data };
    } catch (err) {
      console.warn('[WhatsApp] Meta Cloud API warning:', err.message);
    }
  }

  // 3. Fallback: Log for developer inspection (ensures 0 crash guarantee)
  console.log(`[RentBridge WhatsApp Dispatch to +${normalizedPhone}]:\n${message}\n---`);
  return { 
    success: true, 
    provider: 'simulated_fallback', 
    phone: normalizedPhone,
    deepLink: buildWhatsAppDeepLink(normalizedPhone, message) 
  };
}

// -------------------------------------------------------------
// PRE-BUILT NIGERIAN COMPLIANT MESSAGE TEMPLATES
// -------------------------------------------------------------

/**
 * 1. Viewing Request (Sent to Lister)
 */
export function formatViewingRequestWhatsApp({ listerName, tenantName, tenantPhone, propertyTitle, scheduledDate, timeSlot }) {
  return `🏡 *RentBridge Physical Viewing Request*

Hello ${listerName || 'Property Custodian'},

Prospective tenant *${tenantName}* has booked a free physical inspection for:
📌 *${propertyTitle}*
🗓 *Date:* ${scheduledDate}
⏰ *Time:* ${timeSlot}
📞 *Tenant Phone:* ${tenantPhone}

Please sign in to your RentBridge Lister Dashboard or reply here to confirm compound security clearance.

_RentBridge Nigeria • ₦0 Viewing Fees Guaranteed_`;
}

/**
 * 2. Gate Pass / Viewing Confirmed (Sent to Tenant)
 */
export function formatGatePassWhatsApp({ tenantName, propertyTitle, address, scheduledDate, timeSlot, custodianName, custodianPhone, passCode }) {
  return `🎟️ *RentBridge Official Gate Pass*

Hello ${tenantName},
Your physical inspection is 100% CONFIRMED:

🏠 *Property:* ${propertyTitle}
📍 *Address:* ${address || 'Location provided in dashboard'}
🗓 *Date:* ${scheduledDate}
⏰ *Time:* ${timeSlot}
🔑 *Security Pass Code:* *${passCode || 'RB-' + Math.floor(1000 + Math.random() * 9000)}*

👤 *Verified Custodian:* ${custodianName}
📞 *Phone:* ${custodianPhone}

⚠️ *ZERO AGENT POLICY:*
Never pay gate fees, transport allowance, or registration fees to view this house. Report extortion immediately.`;
}

/**
 * 3. Alternate Time Proposed (Sent to Tenant)
 */
export function formatAlternateTimeWhatsApp({ tenantName, custodianName, propertyTitle, originalDate, proposedDate, proposedSlot }) {
  return `🔄 *RentBridge Schedule Update*

Hello ${tenantName},
Regarding your inspection of *${propertyTitle}*, custodian *${custodianName}* is unavailable on ${originalDate}.

*Proposed New Time:*
🗓 *Date:* ${proposedDate}
⏰ *Time:* ${proposedSlot}

Please log in to your Tenant Dashboard to accept this new time or propose another slot.`;
}

/**
 * 4. Property Approved & Live (Sent to Lister)
 */
export function formatListingApprovedWhatsApp({ listerName, propertyTitle, city }) {
  return `🎉 *Listing Approved & Live!*

Hello ${listerName},
Congratulations! *${propertyTitle}* in *${city}* has completed Phase 1 Deed & Photo Audit.

✅ *Verified Custodian Badge Awarded*
✅ Live on Interactive Map and Property Catalog
✅ 0% Middleman Commission Guaranteed

Prospective tenants can now book direct ₦0-fee viewings. Check your dashboard:
https://rentbridge.ng/dashboard/landlord`;
}

/**
 * 5. Revision Required (Sent to Lister)
 */
export function formatRevisionNeededWhatsApp({ listerName, propertyTitle, feedbackNotes }) {
  return `⚠️ *RentBridge Compliance Update*

Hello ${listerName},
Our verification officer reviewed your listing submission for *${propertyTitle}*.

*Action Needed:*
"${feedbackNotes}"

Please update your draft on your dashboard so we can approve your listing:
https://rentbridge.ng/dashboard/properties`;
}

/**
 * 6. Extortion Alert (Sent to Admin / Compliance Desk)
 */
export function formatExtortionAlertWhatsApp({ propertyTitle, accusedLister, reportingTenant, notes }) {
  return `🚨 *URGENT EXTORTION REPORT*

A tenant reported an illegal fee demand:
🏠 *Property:* ${propertyTitle}
👤 *Accused Lister:* ${accusedLister}
👤 *Reporting Tenant:* ${reportingTenant}
📝 *Complaint:* "${notes}"

Immediate action required on Citadel Admin Desk:
https://rentbridge.ng/dashboard/admin`;
}

/**
 * 7. Draft 30-Day Expiration Warning (Sent to Lister)
 */
export function formatDraftExpiringWhatsApp({ listerName, propertyTitle, daysRemaining }) {
  return `⏳ *Listing Draft Expiring Soon*

Hello ${listerName},
Your unsubmitted listing draft *${propertyTitle}* will expire in *${daysRemaining} days*.

To maintain marketplace freshness, inactive drafts are automatically cleaned up after 30 days. Log in to finish submitting your verification photos:
https://rentbridge.ng/dashboard/properties`;
}

/**
 * 8. Welcome Pack
 */
export function formatWelcomeWhatsApp({ fullName, role }) {
  const roleTitle = role === 'tenant' ? 'Tenant' : role === 'landlord' ? 'Landlord' : role === 'lawyer' ? 'Legal Counsel' : 'Caretaker';
  return `👋 *Welcome to RentBridge Nigeria!*

Hello ${fullName},
Your account has been confirmed as a *Verified ${roleTitle}*.

RentBridge operates strictly across Lagos, Abuja, Port Harcourt, and Enugu with:
✅ ₦0 Physical Inspection Fees
✅ Direct Landlord & Custodian Matchmaking
✅ Zero Street Agent Extortion

Explore your dashboard: https://rentbridge.ng/dashboard`;
}

/**
 * 9. Appointment Locked In (Sent to Custodian)
 */
export function formatAppointmentLockedWhatsApp({ custodianName, propertyTitle, scheduledDate, timeSlot, tenantName, tenantPhone, passCode }) {
  return `🔒 *Viewing Appointment Locked In*

Hello ${custodianName || 'Custodian'},
Your inspection for *${propertyTitle}* is locked into your calendar:

🗓 *Date:* ${scheduledDate}
⏰ *Time:* ${timeSlot}
👤 *Tenant:* ${tenantName}
📞 *Tenant Phone:* ${tenantPhone}
🔑 *Security Pass Code:* *${passCode || 'RB-PASS'}*

Please alert estate security or gate men to expect the visitor with this pass code.`;
}

/**
 * 10. Morning-of Viewing Reminder (Sent at 8:00 AM on Viewing Day)
 */
export function formatMorningInspectionReminderWhatsApp({ name, propertyTitle, address, timeSlot, counterpartName, counterpartPhone, passCode, isTenant }) {
  return `⏰ *RentBridge Morning Viewing Alert*

Good morning ${name},
You have a physical inspection scheduled for *TODAY*!

🏠 *Property:* ${propertyTitle}
📍 *Address:* ${address || 'Location on file'}
⏰ *Time:* ${timeSlot}
👤 *${isTenant ? 'Verified Custodian' : 'Prospective Tenant'}:* ${counterpartName} (${counterpartPhone})
${passCode ? `🔑 *Gate Pass Code:* *${passCode}*\n` : ''}
${isTenant ? '⚠️ *REMINDER:* Physical inspections are 100% free on RentBridge. Never pay money at the gate.' : 'Please ensure the house is accessible and gate security is alerted.'}`;
}

/**
 * 11. Post-Inspection Compliance Check (Sent to Tenant)
 */
export function formatPostInspectionCheckWhatsApp({ tenantName, propertyTitle, inspectionId }) {
  return `🛡️ *Viewing Integrity Check*

Hello ${tenantName},
Regarding your recent viewing of *${propertyTitle}*:

*Were you asked to pay ANY inspection or gate fee?*
• Reply *NO* if it was 100% free as promised.
• Reply *YES* if any money was demanded so we can freeze the listing immediately.

_RentBridge Nigeria Anti-Extortion Desk_`;
}

/**
 * 12. Tenancy Lease Receipt & Zero-Agent Confirmation
 */
export function formatTenancyReceiptWhatsApp({ tenantName, landlordName, propertyTitle, annualRent, leaseStart, leaseEnd }) {
  return `📄 *Official RentBridge Tenancy Receipt*

Congratulations *${tenantName}*!
Your lease for *${propertyTitle}* with *${landlordName}* is confirmed.

💰 *Annual Rent:* ₦${Number(annualRent).toLocaleString()}
🤝 *Agent Commission:* ₦0 (0% Zero Middleman Guarantee)
🗓 *Tenancy Period:* ${leaseStart} to ${leaseEnd}

Your official agreement is archived in your RentBridge Legal Vault.`;
}

/**
 * 13. 60-Day Tenancy Renewal Notice
 */
export function formatRentRenewalWhatsApp({ name, propertyTitle, expiryDate, counterpartName, counterpartPhone }) {
  return `🗓️ *Tenancy Renewal Notice (60 Days)*

Hello ${name},
Your tenancy term for *${propertyTitle}* expires on *${expiryDate}*.

Contact *${counterpartName}* (${counterpartPhone}) to begin early renewal discussions. All lease renewals on RentBridge remain 100% free of middleman commissions.`;
}
