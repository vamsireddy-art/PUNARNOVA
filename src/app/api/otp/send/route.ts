import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { generateOtp, hashOtp } from '@/lib/otp';
import { rateLimiter } from '@/lib/rateLimiter';
import { saveOtp, getResendCooldownSeconds } from '@/lib/otpStore';
import { generateOtpEmailHtml } from '@/lib/emailTemplate';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SEND_LIMIT = Number(process.env.OTP_RATE_LIMIT_MAX) || 5;
const SEND_WINDOW_MS = Number(process.env.OTP_RATE_LIMIT_WINDOW) || 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    console.log(`[API /api/otp/send] Request for email: ${email}`);

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Cooldown check (60s)
    const cooldownRemaining = await getResendCooldownSeconds(email, 60);
    if (cooldownRemaining > 0) {
      return NextResponse.json(
        { success: false, error: `Please wait ${cooldownRemaining}s before requesting a new OTP.` },
        { status: 429 }
      );
    }

    // Hourly rate limit per email
    if (rateLimiter.isLimited(email, SEND_LIMIT, SEND_WINDOW_MS)) {
      return NextResponse.json(
        { success: false, error: 'Too many OTP requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP and store hashed version only
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    console.log(`\n==============================================`);
    console.log(`[OTP DISPATCH] Generated Code: ${otp} for ${email}`);
    console.log(`==============================================\n`);

    await saveOtp(email, otpHash, OTP_TTL_MS);

    // Send email via configured provider (Gmail SMTP / Resend)
    const html = generateOtpEmailHtml(otp, 5);
    const emailResult = await sendEmail(email, 'Verify Your PunarNova Account', html);

    console.log(`[API /api/otp/send] OTP delivery result:`, emailResult);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent! Please check your email inbox.',
    });
  } catch (error: any) {
    console.error('[API /api/otp/send Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send OTP email. Please try again.',
      },
      { status: 500 }
    );
  }
}
