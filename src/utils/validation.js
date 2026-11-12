/**
 * RentBridge Nigeria - Security & Reliability Input Validation Engine
 * 
 * Enforces strict client-side validation rules before network dispatch:
 * 1. Nigerian Phone Format (080, 070, 090, 081, 091, 071, +234)
 * 2. Proper RFC Email Syntax
 * 3. Required String Trimming
 * 4. Numeric Positive Currency Validation
 * 5. Photo Quota Compliance (12 residential / 17 commercial)
 */

/**
 * Validates Nigerian telephone numbers across local (11-digit) and international (+234/234) formats.
 * Accepted prefixes: 070, 080, 081, 090, 091, 071, etc.
 * 
 * @param {string} phone
 * @returns {{ valid: boolean, normalized: string, error?: string }}
 */
export function validateNigerianPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, normalized: '', error: 'Phone number is required.' };
  }

  const cleaned = phone.trim();
  const digitsOnly = cleaned.replace(/[^\d]/g, '');

  // Local 11-digit format starting with 0 (e.g. 08031234567)
  const localNigerianRegex = /^0(70|71|80|81|90|91|82|83|84|85|86|87|88|89)\d{8}$/;
  
  // International format starting with 234 (e.g. 2348031234567 or +2348031234567)
  const intlNigerianRegex = /^234(70|71|80|81|90|91|82|83|84|85|86|87|88|89)\d{8}$/;

  if (localNigerianRegex.test(digitsOnly)) {
    const normalized = '234' + digitsOnly.slice(1);
    return { valid: true, normalized, error: undefined };
  }

  if (intlNigerianRegex.test(digitsOnly)) {
    return { valid: true, normalized: digitsOnly, error: undefined };
  }

  // Handle 10-digit without leading 0
  if (digitsOnly.length === 10 && /^(70|71|80|81|90|91)\d{8}$/.test(digitsOnly)) {
    return { valid: true, normalized: '234' + digitsOnly, error: undefined };
  }

  return {
    valid: false,
    normalized: digitsOnly,
    error: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0803 123 4567 or +234 803 123 4567).'
  };
}

/**
 * Validates standard email address syntax.
 * 
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }

  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  }

  return { valid: true };
}

/**
 * Validates non-empty trimmed text.
 * 
 * @param {string} value
 * @param {string} fieldName
 * @param {number} minLength
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateRequired(value, fieldName = 'This field', minLength = 1) {
  if (!value || typeof value !== 'string' || value.trim().length < minLength) {
    return {
      valid: false,
      error: `${fieldName} is required${minLength > 1 ? ` (minimum ${minLength} characters)` : ''}.`
    };
  }
  return { valid: true };
}

/**
 * Validates positive monetary amounts.
 * 
 * @param {number|string} amount
 * @param {string} fieldName
 * @param {number} minAmount
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePositiveAmount(amount, fieldName = 'Amount', minAmount = 1000) {
  const numeric = Number(String(amount).replace(/,/g, '').trim());
  if (isNaN(numeric) || numeric < minAmount) {
    return {
      valid: false,
      error: `${fieldName} must be a valid amount of at least ₦${minAmount.toLocaleString()}.`
    };
  }
  return { valid: true };
}

/**
 * Validates mandatory property photo quotas.
 * 
 * @param {number} uploadedCount
 * @param {'residential'|'commercial'|'industrial'} category
 * @returns {{ valid: boolean, required: number, remaining: number, error?: string }}
 */
export function validatePhotoQuota(uploadedCount, category = 'residential') {
  const required = category === 'residential' ? 12 : 17;
  const remaining = Math.max(0, required - uploadedCount);
  const valid = uploadedCount >= required;

  return {
    valid,
    required,
    remaining,
    error: valid 
      ? undefined 
      : `Verification requires at least ${required} photos (${remaining} more needed) covering street road, compound gate, and interior.`
  };
}
