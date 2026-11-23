/**
 * PunarNova Multi-Provider Email System
 * 
 * 1. Primary: Gmail SMTP (via Nodemailer) — Sends real emails to ANY recipient email address.
 * 2. Secondary: Resend API — Sends via Resend if RESEND_API_KEY is configured.
 * 3. Local Dev Fallback: ONLY in local development (NODE_ENV !== 'production' and !VERCEL),
 *    logs OTP to terminal and permits testing without credentials.
 *    In PRODUCTION, strict delivery is enforced and secrets/OTPs are NEVER exposed to client.
 */

import nodemailer from 'nodemailer';

export interface SendEmailResult {
  id?: string;
  error?: string;
  devMode?: boolean;
  provider?: 'gmail' | 'resend' | 'dev_fallback';
}

/**
 * Send email using Gmail SMTP
 */
async function sendViaGmail(
  to: string | string[],
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const user = process.env.GMAIL_USER?.trim();
  const rawPass = process.env.GMAIL_APP_PASSWORD?.trim();
  // Strip any accidental spaces from the 16-character App Password (e.g. "shju ncms gimg mxci" -> "shjuncmsgimgmxci")
  const pass = rawPass?.replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('GMAIL_NOT_CONFIGURED');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `"PunarNova" <${user}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  });

  console.log(`[Gmail SMTP] Successfully sent email to ${to} (MessageId: ${info.messageId})`);
  return { id: info.messageId, provider: 'gmail' };
}

/**
 * Send email using Resend API
 */
async function sendViaResend(
  to: string | string[],
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_NOT_CONFIGURED');
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'PunarNova <onboarding@resend.dev>';
  const recipients = Array.isArray(to) ? to : [to];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipients,
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || `Resend failed with status ${response.status}`;
    console.warn(`[Resend Warning] API returned ${response.status}:`, errorMsg);
    throw new Error(errorMsg);
  }

  console.log(`[Resend] Successfully sent email to ${to} (Id: ${data.id})`);
  return { id: data.id, provider: 'resend' };
}

/**
 * Universal sendEmail function
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const recipientStr = Array.isArray(to) ? to.join(', ') : to;
  let lastError: string | null = null;

  // 1. Try Gmail SMTP first if credentials are present
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      return await sendViaGmail(to, subject, html);
    } catch (err: any) {
      lastError = `Gmail SMTP error: ${err.message || err}`;
      console.error('[Gmail SMTP Error]', lastError);
    }
  }

  // 2. Try Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendViaResend(to, subject, html);
    } catch (err: any) {
      lastError = `Resend error: ${err.message || err}`;
      console.warn(`[Resend Delivery Notice] Could not deliver to ${recipientStr}:`, lastError);
    }
  }

  // 3. If in production / Vercel, DO NOT silently fake delivery or expose OTP
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  if (isProduction) {
    throw new Error(
      lastError ||
        'Email delivery credentials (GMAIL_USER, GMAIL_APP_PASSWORD) are not configured in Vercel Environment Variables.'
    );
  }

  // 4. Local dev mode fallback only
  console.log(`\n======================================================`);
  console.log(`[PUNARNOVA DEV OTP DISPATCH]`);
  console.log(`To: ${recipientStr}`);
  console.log(`Subject: ${subject}`);
  console.log(`Notice: Running in local development fallback mode.`);
  console.log(`======================================================\n`);

  return {
    id: `dev-${Date.now()}`,
    provider: 'dev_fallback',
    devMode: true,
  };
}
