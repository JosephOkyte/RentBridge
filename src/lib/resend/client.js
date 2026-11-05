import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder_key';
export const resend = new Resend(resendApiKey);

export const EMAIL_SENDER = process.env.EMAIL_FROM || 'RentBridge Nigeria <notifications@rentbridge.ng>';

