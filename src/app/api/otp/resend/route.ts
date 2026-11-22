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
const RESEND_COOLDOWN_SEC = 60; // 60 seconds

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Enforce 60-second cooldown
    const cooldownRemaining = await getResendCooldownSeconds(email, RESEND_COOLDOWN_SEC);
    if (cooldownRemaining > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${cooldownRemaining} seconds before requesting another code.`,
        },
        { status: 429 }
      );
    }

    // Rate limit per email
    if (rateLimiter.isLimited(email, SEND_LIMIT, SEND_WINDOW_MS)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many OTP requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Invalidate previous OTP by generating and saving a new one
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    await saveOtp(email, otpHash, OTP_TTL_MS);

    // Send the fresh OTP via Resend
    const html = generateOtpEmailHtml(otp, 5);
    await sendEmail(email, 'Verify Your PunarNova Account', html);

    return NextResponse.json({
      success: true,
      message: 'A fresh verification code has been sent to your email.',
    });
  } catch (error: any) {
    console.error('[API /api/otp/resend]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to resend verification email.',
      },
      { status: 500 }
    );
  }
}
