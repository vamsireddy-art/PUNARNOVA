/**
 * Generate branded HTML email for PunarNova OTP verification
 */
export function generateOtpEmailHtml(otp: string, expiryMinutes: number = 5): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your PunarNova Account</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 32px 24px; }
    .otp-box { text-align: center; margin: 28px 0; background: #f1f5f9; padding: 20px; border-radius: 12px; border: 1px dashed #cbd5e1; }
    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; font-family: monospace; }
    .warning { font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PunarNova</h1>
      <p>Discover &bull; Reuse &bull; Grow &mdash; Campus Peer-to-Peer Educational Exchange</p>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Verify Your Email Address</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Welcome to PunarNova! Use the verification code below to confirm your educational email and complete your account registration:
      </p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">Valid for ${expiryMinutes} minutes</p>
      </div>
      <div class="warning">
        <p><strong>Security Note:</strong> Never share this code with anyone. PunarNova staff will never ask for your verification code.</p>
        <p>If you did not initiate this request, you can safely ignore this email.</p>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PunarNova. Circular Economy for Universities.
    </div>
  </div>
</body>
</html>
`;
}
