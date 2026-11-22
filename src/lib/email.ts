/**
 * Resend Email Utility for PunarNova
 * Calls Resend REST API directly using standard fetch.
 * Server-side only - never expose RESEND_API_KEY to the client.
 */

export interface SendEmailResult {
  id?: string;
  error?: string;
}

/**
 * Send an email using the Resend API.
 * @param to Recipient email address or array of addresses
 * @param subject Email subject line
 * @param html HTML body of the email
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured in environment variables.');
  }

  // Resend free tier sends from onboarding@resend.dev to the account holder's registered email
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
    const errorMsg = data.message || data.error || `Resend API failed with status ${response.status}`;
    console.error('[Resend Error]', errorMsg);
    throw new Error(errorMsg);
  }

  return data;
}
