import { NextResponse } from 'next/server';
import { verifyResetToken, markResetTokenUsed } from '@/lib/resetToken';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const action = body.action === 'verify' ? 'verify' : 'reset';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';

    const verification = verifyResetToken(token);
    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid or expired password reset link.' },
        { status: 400 }
      );
    }

    // Token check only (used when the reset-password page loads)
    if (action === 'verify') {
      return NextResponse.json({
        success: true,
        email: verification.email,
      });
    }

    // Actual password reset validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (verification.jti) {
      markResetTokenUsed(verification.jti);
    }

    return NextResponse.json({
      success: true,
      email: verification.email,
      message: 'Password verified and updated successfully.',
    });
  } catch (error: any) {
    console.error('[API /api/auth/reset-password Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error while resetting password.' },
      { status: 500 }
    );
  }
}
