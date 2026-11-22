import fs from 'fs';
import path from 'path';
import os from 'os';

export interface OtpRecord {
  email: string;
  otpHash: string;
  expiresAt: string; // ISO string
  attempts: number;
  lastSentAt: string; // ISO string
  createdAt: string; // ISO string
}

// Global in-memory cache shared across warm serverless container invocations
declare global {
  // eslint-disable-next-line no-var
  var __memoryOtpStore: Record<string, OtpRecord> | undefined;
}

if (!globalThis.__memoryOtpStore) {
  globalThis.__memoryOtpStore = {};
}

/**
 * Get writable path for OTP persistence.
 * On Vercel / AWS Lambda, process.cwd() is strictly read-only; os.tmpdir() (/tmp) must be used.
 */
function getStoreFilePath(): string {
  try {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
      return path.join(os.tmpdir(), '.otp_store.json');
    }
  } catch {
    // fallback
  }
  return path.join(process.cwd(), '.otp_store.json');
}

/**
 * Read the store from disk and/or global memory
 */
function readStore(): Record<string, OtpRecord> {
  const memStore = globalThis.__memoryOtpStore || {};
  const filePath = getStoreFilePath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content || '{}');
      // Merge disk and memory (disk overrides if newer)
      return { ...memStore, ...parsed };
    }
  } catch (err) {
    // If filesystem read is restricted, return in-memory store
  }

  return { ...memStore };
}

/**
 * Write to both disk and global memory
 */
function writeStore(data: Record<string, OtpRecord>): void {
  // 1. Update in-memory cache
  globalThis.__memoryOtpStore = { ...data };

  // 2. Persist to disk (tmpdir on Vercel, cwd in local dev)
  const filePath = getStoreFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[OtpStore] Disk write notice (using memory store):', err);
  }
}

/**
 * Save or replace an OTP record for an email address.
 */
export async function saveOtp(email: string, otpHash: string, ttlMs: number = 5 * 60 * 1000): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);

  const record: OtpRecord = {
    email: normalizedEmail,
    otpHash,
    expiresAt: expiresAt.toISOString(),
    attempts: 0,
    lastSentAt: now.toISOString(),
    createdAt: now.toISOString(),
  };

  const store = readStore();
  store[normalizedEmail] = record;
  writeStore(store);

  console.log(`[OtpStore] Saved OTP for ${normalizedEmail}, expires at ${record.expiresAt}`);
}

/**
 * Retrieve the active OTP record for an email.
 */
export async function getOtp(email: string): Promise<OtpRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const store = readStore();
  const record = store[normalizedEmail];

  if (record) {
    console.log(`[OtpStore] Found OTP record for ${normalizedEmail}, expires at ${record.expiresAt}`);
  } else {
    console.log(`[OtpStore] No OTP record found for ${normalizedEmail}`);
  }

  return record || null;
}

/**
 * Increment verification attempts count.
 */
export async function incrementAttempts(email: string): Promise<number> {
  const normalizedEmail = email.trim().toLowerCase();
  const store = readStore();
  const record = store[normalizedEmail];

  if (record) {
    record.attempts = (record.attempts ?? 0) + 1;
    store[normalizedEmail] = record;
    writeStore(store);
    return record.attempts;
  }

  return 1;
}

/**
 * Delete OTP record once successfully verified.
 */
export async function deleteOtp(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const store = readStore();
  delete store[normalizedEmail];
  writeStore(store);
  console.log(`[OtpStore] Cleared OTP for ${normalizedEmail}`);
}

/**
 * Check cooldown seconds remaining before allowing a resend.
 */
export async function getResendCooldownSeconds(email: string, cooldownSeconds: number = 60): Promise<number> {
  const record = await getOtp(email);
  if (!record || !record.lastSentAt) return 0;

  const lastSent = new Date(record.lastSentAt).getTime();
  const elapsedSeconds = Math.floor((Date.now() - lastSent) / 1000);
  const remaining = cooldownSeconds - elapsedSeconds;

  return remaining > 0 ? remaining : 0;
}
