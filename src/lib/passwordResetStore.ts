import fs from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';

interface ResetPasswordRecord {
  email: string;
  passwordHash: string;
  updatedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryPasswordResetStore: Record<string, ResetPasswordRecord> | undefined;
}

if (!globalThis.__memoryPasswordResetStore) {
  globalThis.__memoryPasswordResetStore = {};
}

const BUCKET_NAME = 'punarnova-auth-resets';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey || url.includes('xyzcompany')) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getStoreFilePath(): string {
  try {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
      return path.join(os.tmpdir(), '.password_reset_store.json');
    }
  } catch {
    // fallback
  }
  return path.join(process.cwd(), '.password_reset_store.json');
}

function readLocalStore(): Record<string, ResetPasswordRecord> {
  const mem = globalThis.__memoryPasswordResetStore || {};
  const filePath = getStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '{}');
      return { ...mem, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...mem };
}

function writeLocalStore(data: Record<string, ResetPasswordRecord>): void {
  globalThis.__memoryPasswordResetStore = { ...data };
  const filePath = getStoreFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // ignore read-only fs
  }
}

export function hashPassword(password: string): string {
  return createHash('sha256').update(password.trim()).digest('hex');
}

function getEmailObjectKey(normalizedEmail: string): string {
  const hash = createHash('sha256').update(normalizedEmail).digest('hex');
  return `${hash}.json`;
}

export async function saveResetPassword(email: string, newPassword: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const record: ResetPasswordRecord = {
    email: normalized,
    passwordHash: hashPassword(newPassword),
    updatedAt: new Date().toISOString(),
  };

  // 1. Always save to local memory + /tmp
  const store = readLocalStore();
  store[normalized] = record;
  writeLocalStore(store);

  // 2. Persist to Supabase Storage so it works across all Vercel Lambda instances & devices
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data: buckets } = await admin.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === BUCKET_NAME);
      if (!exists) {
        await admin.storage.createBucket(BUCKET_NAME, { public: false });
      }
      const key = getEmailObjectKey(normalized);
      await admin.storage
        .from(BUCKET_NAME)
        .upload(key, JSON.stringify(record), {
          contentType: 'application/json',
          upsert: true,
        });
    } catch (err) {
      console.warn('[PasswordResetStore] Supabase storage write warning:', err);
    }
  }
}

export async function verifyResetPassword(email: string, password: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const candidateHash = hashPassword(password);

  // 1. Check Supabase Storage first (authoritative cross-device / cross-lambda source)
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const key = getEmailObjectKey(normalized);
      const { data, error } = await admin.storage.from(BUCKET_NAME).download(key);
      if (!error && data) {
        const text = await data.text();
        const record: ResetPasswordRecord = JSON.parse(text);
        if (record?.passwordHash) {
          // Cache locally too
          const local = readLocalStore();
          local[normalized] = record;
          writeLocalStore(local);
          return record.passwordHash === candidateHash;
        }
      }
    } catch (err) {
      console.warn('[PasswordResetStore] Supabase storage read warning:', err);
    }
  }

  // 2. Fallback to local memory / /tmp
  const store = readLocalStore();
  const record = store[normalized];
  if (!record) return false;
  return record.passwordHash === candidateHash;
}
