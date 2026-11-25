import { NextResponse } from 'next/server';
import { verifyResetPassword } from '@/lib/passwordResetStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const valid = await verifyResetPassword(email, password);
    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
