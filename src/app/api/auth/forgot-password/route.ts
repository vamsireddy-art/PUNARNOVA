import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { rateLimiter } from '@/lib/rateLimiter';
import { createResetToken } from '@/lib/resetToken';
import { generatePasswordResetEmailHtml } from '@/lib/emailTemplate';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const RESET_LIMIT = 5;
const RESET_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RESET_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid registered email address.' },
        { status: 400 }
      );
    }

    if (rateLimiter.isLimited(`pwd_reset:${email}`, RESET_LIMIT, RESET_WINDOW_MS)) {
      return NextResponse.json(
        { success: false, error: 'Too many password reset requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const token = createResetToken(email, RESET_TTL_MS);

    // Resolve the active app base URL (works on localhost and Vercel)
    const originHeader = request.headers.get('origin');
    const baseUrl =
      originHeader ||
      process.env.NEXT_PUBLIC_APP_URL ||
      request.nextUrl.origin ||
      'http://localhost:3000';

    const resetUrl = `${baseUrl.replace(/\/+$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}`;

    const html = generatePasswordResetEmailHtml(resetUrl, 15);
    const emailResult = await sendEmail(email, 'Reset Your PunarNova Password', html);

    console.log(`[API /api/auth/forgot-password] Reset link dispatched to ${email} via ${emailResult.provider}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email address. Please check your inbox (and spam folder).',
    });
  } catch (error: any) {
    console.error('[API /api/auth/forgot-password Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send password reset email. Please try again.',
      },
      { status: 500 }
    );
  }
}
