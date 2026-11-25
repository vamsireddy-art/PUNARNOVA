import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

interface ResetTokenPayload {
  email: string;
  exp: number;
  jti: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __usedResetTokens: Set<string> | undefined;
}

if (!globalThis.__usedResetTokens) {
  globalThis.__usedResetTokens = new Set<string>();
}

function getSecret(): string {
  return (
    process.env.RESET_TOKEN_SECRET ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'punarnova-password-reset-hmac-secret-2026'
  );
}

/**
 * Create a tamper-proof, expiring HMAC-SHA256 password reset token.
 */
export function createResetToken(email: string, ttlMs: number = 15 * 60 * 1000): string {
  const payload: ResetTokenPayload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + ttlMs,
    jti: randomBytes(12).toString('hex'),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const signature = createHmac('sha256', getSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify a password reset token's signature, expiry, and single-use status.
 */
export function verifyResetToken(token: string): {
  valid: boolean;
  email?: string;
  jti?: string;
  error?: string;
} {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, error: 'Invalid password reset link.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed password reset link.' };
  }

  const [encodedPayload, providedSig] = parts;

  const expectedSig = createHmac('sha256', getSecret())
    .update(encodedPayload)
    .digest('base64url');

  const sigBufA = Buffer.from(providedSig, 'utf-8');
  const sigBufB = Buffer.from(expectedSig, 'utf-8');

  if (sigBufA.length !== sigBufB.length || !timingSafeEqual(sigBufA, sigBufB)) {
    return { valid: false, error: 'Invalid or tampered password reset link.' };
  }

  try {
    const rawJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload: ResetTokenPayload = JSON.parse(rawJson);

    if (!payload.email || !payload.exp || !payload.jti) {
      return { valid: false, error: 'Invalid reset token payload.' };
    }

    if (Date.now() > payload.exp) {
      return { valid: false, error: 'This password reset link has expired. Please request a new one.' };
    }

    if (globalThis.__usedResetTokens?.has(payload.jti)) {
      return { valid: false, error: 'This password reset link has already been used. Please request a new one.' };
    }

    return { valid: true, email: payload.email, jti: payload.jti };
  } catch {
    return { valid: false, error: 'Could not decode password reset link.' };
  }
}

/**
 * Mark a reset token as consumed so it cannot be reused.
 */
export function markResetTokenUsed(jti: string): void {
  if (jti && globalThis.__usedResetTokens) {
    globalThis.__usedResetTokens.add(jti);
  }
}
