import { randomInt } from 'crypto';
import { createHash } from 'crypto';

/**
 * Generate a cryptographically secure 6‑digit OTP as a string.
 */
export function generateOtp(): string {
  // randomInt is inclusive of min, exclusive of max
  const otp = randomInt(100000, 1000000); // 100000‑999999
  return otp.toString();
}

/**
 * Return a SHA‑256 hash of the OTP (hex string).
 * Storing a hash prevents the plain OTP from ever being persisted.
 */
export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}
