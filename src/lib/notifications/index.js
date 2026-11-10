/**
 * RentBridge Unified Notification Dispatcher
 * Dispatches HTML Emails (Resend) and WhatsApp alerts in parallel.
 * Guaranteed zero-crash: wraps all channels in Promise.allSettled and catches errors gracefully.
 */

import {
  sendInspectionBookedEmails,
  sendGatePassConfirmedEmail,
  sendAppointmentLockedEmail,
  sendAlternateTimeProposedEmail,
  sendMorningInspectionReminderEmail,
  sendPostInspectionComplianceCheckEmail,
  sendPropertySubmittedEmail,
  sendPropertyApprovedEmail,
  sendRevisionRequestedEmail,
  sendFraudReportAlertEmail,
  sendDraftExpiringWarningEmail,
  sendPropertyMarkedRentedEmail,
  sendTenancyAgreementReceiptEmail,
  sendRentRenewalReminderEmail,
  sendAccountBlacklistedEmail,
  sendWelcomeTenantEmail,
  sendWelcomeCustodianEmail,
} from '../resend/emails';

import {
  sendWhatsAppMessage,
  formatViewingRequestWhatsApp,
  formatGatePassWhatsApp,
  formatAppointmentLockedWhatsApp,
  formatAlternateTimeWhatsApp,
  formatMorningInspectionReminderWhatsApp,
  formatPostInspectionCheckWhatsApp,
  formatListingApprovedWhatsApp,
  formatRevisionNeededWhatsApp,
  formatExtortionAlertWhatsApp,
  formatDraftExpiringWhatsApp,
  formatTenancyReceiptWhatsApp,
  formatRentRenewalWhatsApp,
  formatWelcomeWhatsApp,
} from './whatsapp';

/**
 * 1. Viewing Booked: Notify Tenant and Custodian via Email + WhatsApp
 */
export async function notifyInspectionBooked({
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
  const tasks = [];

  // Email to both
  tasks.push(
    sendInspectionBookedEmails({
      tenantEmail,
      tenantName,
      tenantPhone,
      listerEmail,
      listerName,
      listerPhone,
      propertyTitle,
      scheduledDate,
      timeSlot,
    })
  );

  // WhatsApp to Lister
  if (listerPhone) {
    const listerWaMsg = formatViewingRequestWhatsApp({
      listerName,
      tenantName,
      tenantPhone,
      propertyTitle,
      scheduledDate,
      timeSlot,
    });
    tasks.push(sendWhatsAppMessage({ phone: listerPhone, message: listerWaMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 2. Gate Pass Confirmed: Issue official gate pass code to Tenant via Email + WhatsApp
 */
export async function notifyGatePassConfirmed({
  tenantEmail,
  tenantName,
  tenantPhone,
  propertyTitle,
  address,
  scheduledDate,
  timeSlot,
  custodianName,
  custodianPhone,
  passCode,
}) {
  const code = passCode || `RB-${Math.floor(1000 + Math.random() * 9000)}`;
  const tasks = [];

  if (tenantEmail) {
    tasks.push(
      sendGatePassConfirmedEmail({
        tenantEmail,
        tenantName,
        propertyTitle,
        address,
        scheduledDate,
        timeSlot,
        custodianName,
        custodianPhone,
        passCode: code,
      })
    );
  }

  if (tenantPhone) {
    const waMsg = formatGatePassWhatsApp({
      tenantName,
      propertyTitle,
      address,
      scheduledDate,
      timeSlot,
      custodianName,
      custodianPhone,
      passCode: code,
    });
    tasks.push(sendWhatsAppMessage({ phone: tenantPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, passCode: code, results };
}

/**
 * 3. Appointment Locked In (Alert to Custodian)
 */
export async function notifyAppointmentLocked({
  custodianEmail,
  custodianName,
  custodianPhone,
  propertyTitle,
  address,
  scheduledDate,
  timeSlot,
  tenantName,
  tenantPhone,
  passCode,
}) {
  const tasks = [];

  if (custodianEmail) {
    tasks.push(
      sendAppointmentLockedEmail({
        custodianEmail,
        custodianName,
        propertyTitle,
        address,
        scheduledDate,
        timeSlot,
        tenantName,
        tenantPhone,
        passCode,
      })
    );
  }

  if (custodianPhone) {
    const waMsg = formatAppointmentLockedWhatsApp({
      custodianName,
      propertyTitle,
      scheduledDate,
      timeSlot,
      tenantName,
      tenantPhone,
      passCode,
    });
    tasks.push(sendWhatsAppMessage({ phone: custodianPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 4. Alternate Time Proposed: Custodian proposes a new slot
 */
export async function notifyAlternateTimeProposed({
  tenantEmail,
  tenantName,
  tenantPhone,
  propertyTitle,
  custodianName,
  originalDate,
  proposedDate,
  proposedSlot,
}) {
  const tasks = [];

  if (tenantEmail) {
    tasks.push(
      sendAlternateTimeProposedEmail({
        tenantEmail,
        tenantName,
        propertyTitle,
        custodianName,
        originalDate,
        proposedDate,
        proposedSlot,
      })
    );
  }

  if (tenantPhone) {
    const waMsg = formatAlternateTimeWhatsApp({
      tenantName,
      custodianName,
      propertyTitle,
      originalDate,
      proposedDate,
      proposedSlot,
    });
    tasks.push(sendWhatsAppMessage({ phone: tenantPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 5. Morning-of-Inspection Reminder (Sent at 8:00 AM on Viewing Day)
 */
export async function notifyMorningInspectionReminder({
  email,
  phone,
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
  const tasks = [];

  if (email) {
    tasks.push(
      sendMorningInspectionReminderEmail({
        email,
        name,
        propertyTitle,
        address,
        scheduledDate,
        timeSlot,
        counterpartName,
        counterpartPhone,
        passCode,
        isTenant,
      })
    );
  }

  if (phone) {
    const waMsg = formatMorningInspectionReminderWhatsApp({
      name,
      propertyTitle,
      address,
      timeSlot,
      counterpartName,
      counterpartPhone,
      passCode,
      isTenant,
    });
    tasks.push(sendWhatsAppMessage({ phone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 6. Post-Inspection Compliance Check (Sent 3 hours after viewing to Tenant)
 */
export async function notifyPostInspectionComplianceCheck({
  tenantEmail,
  tenantPhone,
  tenantName,
  propertyTitle,
  custodianName,
  inspectionId,
}) {
  const tasks = [];

  if (tenantEmail) {
    tasks.push(
      sendPostInspectionComplianceCheckEmail({
        tenantEmail,
        tenantName,
        propertyTitle,
        custodianName,
        inspectionId,
      })
    );
  }

  if (tenantPhone) {
    const waMsg = formatPostInspectionCheckWhatsApp({
      tenantName,
      propertyTitle,
      inspectionId,
    });
    tasks.push(sendWhatsAppMessage({ phone: tenantPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 7. Property Submitted for Verification: Sent to Lister
 */
export async function notifyPropertySubmitted({
  listerEmail,
  listerName,
  propertyTitle,
  photoCount,
}) {
  const tasks = [];

  if (listerEmail) {
    tasks.push(
      sendPropertySubmittedEmail({
        listerEmail,
        listerName,
        propertyTitle,
        photoCount,
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 8. Property Approved & Live: Notify Lister via Email + WhatsApp
 */
export async function notifyPropertyApproved({
  listerEmail,
  listerName,
  listerPhone,
  propertyTitle,
  city,
}) {
  const tasks = [];

  if (listerEmail) {
    tasks.push(
      sendPropertyApprovedEmail({
        listerEmail,
        listerName,
        propertyTitle,
        city,
      })
    );
  }

  if (listerPhone) {
    const waMsg = formatListingApprovedWhatsApp({
      listerName,
      propertyTitle,
      city,
    });
    tasks.push(sendWhatsAppMessage({ phone: listerPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 9. Revision Requested: Notify Lister of needed photo/deed clarification
 */
export async function notifyRevisionRequested({
  listerEmail,
  listerName,
  listerPhone,
  propertyTitle,
  feedbackNotes,
}) {
  const tasks = [];

  if (listerEmail) {
    tasks.push(
      sendRevisionRequestedEmail({
        listerEmail,
        listerName,
        propertyTitle,
        feedbackNotes,
      })
    );
  }

  if (listerPhone) {
    const waMsg = formatRevisionNeededWhatsApp({
      listerName,
      propertyTitle,
      feedbackNotes,
    });
    tasks.push(sendWhatsAppMessage({ phone: listerPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 10. Extortion Incident Flagged: Notify Admin Compliance Desk
 */
export async function notifyExtortionReported({
  adminEmail,
  adminPhone,
  propertyTitle,
  listerName,
  tenantName,
  reportNotes,
}) {
  const tasks = [];

  tasks.push(
    sendFraudReportAlertEmail({
      adminEmail: adminEmail || process.env.ADMIN_ALERT_EMAIL || 'admin@rentbridge.ng',
      propertyTitle,
      listerName,
      tenantName,
      reportNotes,
    })
  );

  const compliancePhone = adminPhone || process.env.ADMIN_WHATSAPP_PHONE;
  if (compliancePhone) {
    const waMsg = formatExtortionAlertWhatsApp({
      propertyTitle,
      accusedLister: listerName,
      reportingTenant: tenantName,
      notes: reportNotes,
    });
    tasks.push(sendWhatsAppMessage({ phone: compliancePhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 11. 30-Day Draft Expiration Warning
 */
export async function notifyDraftExpiring({
  listerEmail,
  listerName,
  listerPhone,
  propertyTitle,
  daysRemaining,
}) {
  const tasks = [];

  if (listerEmail) {
    tasks.push(
      sendDraftExpiringWarningEmail({
        listerEmail,
        listerName,
        propertyTitle,
        daysRemaining,
      })
    );
  }

  if (listerPhone) {
    const waMsg = formatDraftExpiringWhatsApp({
      listerName,
      propertyTitle,
      daysRemaining,
    });
    tasks.push(sendWhatsAppMessage({ phone: listerPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 12. Property Marked as Rented
 */
export async function notifyPropertyMarkedRented({
  listerEmail,
  listerName,
  propertyTitle,
}) {
  const tasks = [];

  if (listerEmail) {
    tasks.push(
      sendPropertyMarkedRentedEmail({
        listerEmail,
        listerName,
        propertyTitle,
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 13. Tenancy Lease Agreement & Official Receipt
 */
export async function notifyTenancyReceipt({
  tenantEmail,
  tenantPhone,
  tenantName,
  landlordEmail,
  landlordPhone,
  landlordName,
  propertyTitle,
  address,
  annualRent,
  cautionDeposit = 0,
  serviceCharge = 0,
  leaseStartDate,
  leaseEndDate,
}) {
  const tasks = [];

  if (tenantEmail) {
    tasks.push(
      sendTenancyAgreementReceiptEmail({
        recipientEmail: tenantEmail,
        recipientName: tenantName,
        counterpartName: landlordName,
        propertyTitle,
        address,
        annualRent,
        cautionDeposit,
        serviceCharge,
        leaseStartDate,
        leaseEndDate,
        isLandlord: false,
      })
    );
  }

  if (landlordEmail) {
    tasks.push(
      sendTenancyAgreementReceiptEmail({
        recipientEmail: landlordEmail,
        recipientName: landlordName,
        counterpartName: tenantName,
        propertyTitle,
        address,
        annualRent,
        cautionDeposit,
        serviceCharge,
        leaseStartDate,
        leaseEndDate,
        isLandlord: true,
      })
    );
  }

  if (tenantPhone) {
    const waMsg = formatTenancyReceiptWhatsApp({
      tenantName,
      landlordName,
      propertyTitle,
      annualRent,
      leaseStart: leaseStartDate,
      leaseEnd: leaseEndDate,
    });
    tasks.push(sendWhatsAppMessage({ phone: tenantPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 14. 60-Day Tenancy Renewal Reminder
 */
export async function notifyRentRenewal({
  tenantEmail,
  tenantPhone,
  tenantName,
  landlordEmail,
  landlordPhone,
  landlordName,
  propertyTitle,
  expiryDate,
}) {
  const tasks = [];

  if (tenantEmail) {
    tasks.push(
      sendRentRenewalReminderEmail({
        email: tenantEmail,
        name: tenantName,
        propertyTitle,
        expiryDate,
        isLandlord: false,
        counterpartName: landlordName,
        counterpartPhone: landlordPhone,
      })
    );
  }

  if (landlordEmail) {
    tasks.push(
      sendRentRenewalReminderEmail({
        email: landlordEmail,
        name: landlordName,
        propertyTitle,
        expiryDate,
        isLandlord: true,
        counterpartName: tenantName,
        counterpartPhone: tenantPhone,
      })
    );
  }

  if (tenantPhone) {
    const waMsg = formatRentRenewalWhatsApp({
      name: tenantName,
      propertyTitle,
      expiryDate,
      counterpartName: landlordName,
      counterpartPhone: landlordPhone,
    });
    tasks.push(sendWhatsAppMessage({ phone: tenantPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 15. Account Blacklisted Alert
 */
export async function notifyAccountBlacklisted({
  userEmail,
  userName,
  userPhone,
  reason,
}) {
  const tasks = [];

  if (userEmail) {
    tasks.push(
      sendAccountBlacklistedEmail({
        userEmail,
        userName,
        reason,
      })
    );
  }

  if (userPhone) {
    const waMsg = `🚨 *RentBridge Account Frozen & Blacklisted*\n\nHello ${userName},\nYour account has been blacklisted for violating our ₦0 inspection fee guarantee: "${reason}". Contact compliance@rentbridge.ng for appeals.`;
    tasks.push(sendWhatsAppMessage({ phone: userPhone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}

/**
 * 16. Welcome Pack on Account Role Confirmation
 */
export async function notifyWelcome({
  email,
  phone,
  name,
  role,
}) {
  const tasks = [];

  if (role === 'tenant') {
    if (email) tasks.push(sendWelcomeTenantEmail({ email, name }));
  } else {
    if (email) tasks.push(sendWelcomeCustodianEmail({ email, name, role }));
  }

  if (phone) {
    const waMsg = formatWelcomeWhatsApp({ fullName: name, role });
    tasks.push(sendWhatsAppMessage({ phone, message: waMsg }));
  }

  const results = await Promise.allSettled(tasks);
  return { success: true, results };
}
