import { NextResponse } from 'next/server';
import { hashOtp } from '@/lib/otp';
import { rateLimiter } from '@/lib/rateLimiter';
import { getOtp, incrementAttempts, deleteOtp } from '@/lib/otpStore';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_VERIFY_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const otp = typeof body.otp === 'string' ? body.otp.trim() : '';

    console.log(`[API /api/otp/verify] Request for email: ${email}, otp length: ${otp.length}`);

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 6-digit verification code.' }, { status: 400 });
    }

    // Rate limiter on verification endpoint per email
    if (rateLimiter.isLimited(`${email}-verify`, MAX_VERIFY_ATTEMPTS * 2, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many failed verification attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    const record = await getOtp(email);
    console.log(`[API /api/otp/verify] Record found: ${!!record}`);

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'No active verification code found. Please request a new one.' },
        { status: 404 }
      );
    }

    // Check expiration
    if (new Date() > new Date(record.expiresAt)) {
      await deleteOtp(email);
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // Check attempt limit
    const attempts = await incrementAttempts(email);
    if (attempts > MAX_VERIFY_ATTEMPTS) {
      await deleteOtp(email);
      return NextResponse.json(
        { success: false, error: 'Maximum attempts exceeded. This code is invalidated. Please request a new code.' },
        { status: 400 }
      );
    }

    // Securely compare hashes
    const inputHash = hashOtp(otp);
    console.log(`[API /api/otp/verify] Comparing hashes - stored: ${record.otpHash.substring(0, 8)}... vs input: ${inputHash.substring(0, 8)}...`);

    if (inputHash !== record.otpHash) {
      const remainingAttempts = Math.max(0, MAX_VERIFY_ATTEMPTS - attempts);
      return NextResponse.json(
        {
          success: false,
          error: `Incorrect verification code. ${remainingAttempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // Verified! Delete OTP to prevent reuse
    await deleteOtp(email);
    console.log(`[API /api/otp/verify] ✅ Email ${email} verified successfully`);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error: any) {
    console.error('[API /api/otp/verify]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error during verification.' },
      { status: 500 }
    );
  }
}
