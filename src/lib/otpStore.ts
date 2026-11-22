import fs from 'fs';
import path from 'path';

export interface OtpRecord {
  email: string;
  otpHash: string;
  expiresAt: string; // ISO string
  attempts: number;
  lastSentAt: string; // ISO string
  createdAt: string; // ISO string
}

const STORE_FILE = path.join(process.cwd(), '.otp_store.json');

/**
 * Read the disk store fresh every time (no caching).
 * This is critical for Next.js dev mode where API routes compile in separate workers.
 */
function readDiskStore(): Record<string, OtpRecord> {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content || '{}');
      return parsed;
    }
  } catch (err) {
    console.warn('[OtpStore] Could not read disk store:', err);
  }
  return {};
}

function writeDiskStore(data: Record<string, OtpRecord>): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[OtpStore] Could not write disk store:', err);
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

  // Always read fresh from disk, merge, and write back
  const disk = readDiskStore();
  disk[normalizedEmail] = record;
  writeDiskStore(disk);

  console.log(`[OtpStore] Saved OTP for ${normalizedEmail}, expires at ${record.expiresAt}`);
}

/**
 * Retrieve the active OTP record for an email.
 * Always reads fresh from disk to handle Next.js multi-worker dev mode.
 */
export async function getOtp(email: string): Promise<OtpRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // Always read directly from disk — never rely on in-memory cache
  const disk = readDiskStore();
  const record = disk[normalizedEmail];

  if (record) {
    console.log(`[OtpStore] Found OTP record for ${normalizedEmail}, expires at ${record.expiresAt}, attempts: ${record.attempts}`);
  } else {
    console.log(`[OtpStore] No OTP record found for ${normalizedEmail}. Disk store keys: [${Object.keys(disk).join(', ')}]`);
  }

  return record || null;
}

/**
 * Increment verification attempts count.
 */
export async function incrementAttempts(email: string): Promise<number> {
  const normalizedEmail = email.trim().toLowerCase();
  const disk = readDiskStore();
  const record = disk[normalizedEmail];

  if (record) {
    record.attempts = (record.attempts ?? 0) + 1;
    disk[normalizedEmail] = record;
    writeDiskStore(disk);
    return record.attempts;
  }

  return 1;
}

/**
 * Delete OTP record on successful verification or invalidation.
 */
export async function deleteOtp(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  const disk = readDiskStore();
  if (disk[normalizedEmail]) {
    delete disk[normalizedEmail];
    writeDiskStore(disk);
    console.log(`[OtpStore] Deleted OTP record for ${normalizedEmail}`);
  }
}

/**
 * Check if the email is in cooldown for resending.
 * Returns seconds remaining if in cooldown, or 0 if allowed.
 */
export async function getResendCooldownSeconds(email: string, cooldownDurationSec: number = 60): Promise<number> {
  const record = await getOtp(email);
  if (!record || !record.lastSentAt) return 0;

  const lastSentTime = new Date(record.lastSentAt).getTime();
  const elapsedSec = (Date.now() - lastSentTime) / 1000;
  if (elapsedSec < cooldownDurationSec) {
    return Math.ceil(cooldownDurationSec - elapsedSec);
  }
  return 0;
}
