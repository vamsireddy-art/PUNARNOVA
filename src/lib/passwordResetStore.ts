import fs from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

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

function readStore(): Record<string, ResetPasswordRecord> {
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

function writeStore(data: Record<string, ResetPasswordRecord>): void {
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

export function saveResetPassword(email: string, newPassword: string): void {
  const normalized = email.trim().toLowerCase();
  const store = readStore();
  store[normalized] = {
    email: normalized,
    passwordHash: hashPassword(newPassword),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
}

export function verifyResetPassword(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  const store = readStore();
  const record = store[normalized];
  if (!record) return false;
  return record.passwordHash === hashPassword(password);
}
