import { User } from '@/types';

export interface StoredAccount {
  user: User;
  password: string; // Plain/hashed for client store
}

const REGISTERED_ACCOUNTS_KEY = 'punarnova_registered_accounts';

// Built-in Administrator Account
export const DEFAULT_ADMIN: StoredAccount = {
  user: {
    id: 'user-admin',
    email: 'admin@punarnova.in',
    mobileNumber: '+91 99999 88888',
    fullName: 'System Administrator',
    role: 'admin',
    isMobileVerified: true,
    isEmailVerified: true,
    verificationStatus: 'verified',
    verifiedLegalName: 'Administrator',
    institutionName: 'PunarNova Central Admin',
    institutionType: 'University',
    bio: 'Platform Administrator & Compliance Moderator',
    salesCount: 0,
    purchasesCount: 0,
    carbonSavedKg: 0,
    moneySavedInr: 0,
    createdAt: '2024-01-01T00:00:00Z',
  },
  password: 'Admin@PunarNova2026',
};

/**
 * Get all registered accounts from local storage.
 * Always includes the built-in Admin.
 */
export function getRegisteredAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [DEFAULT_ADMIN];

  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    if (!raw) {
      const initial = [DEFAULT_ADMIN];
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(initial));
      return initial;
    }
    const accounts: StoredAccount[] = JSON.parse(raw);
    // Ensure admin is always present
    const hasAdmin = accounts.some(
      (a) => a.user.email.toLowerCase() === DEFAULT_ADMIN.user.email.toLowerCase()
    );
    if (!hasAdmin) {
      accounts.push(DEFAULT_ADMIN);
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
    return accounts;
  } catch {
    return [DEFAULT_ADMIN];
  }
}

/**
 * Register a newly created user account with their password.
 */
export function registerAccount(user: User, password: string): void {
  if (typeof window === 'undefined') return;

  const accounts = getRegisteredAccounts();
  const index = accounts.findIndex(
    (a) => a.user.email.toLowerCase() === user.email.toLowerCase()
  );

  const newAccount: StoredAccount = { user, password };

  if (index >= 0) {
    accounts[index] = newAccount;
  } else {
    accounts.push(newAccount);
  }

  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

/**
 * Authenticate against registered accounts.
 * Returns the User if credentials match, or null otherwise.
 */
export function authenticateUser(identifier: string, password: string): User | null {
  const accounts = getRegisteredAccounts();
  const cleanId = identifier.trim().toLowerCase();
  const cleanPw = password.trim();

  const found = accounts.find((acc) => {
    const emailMatch = acc.user.email.toLowerCase() === cleanId;
    const mobileMatch = acc.user.mobileNumber && acc.user.mobileNumber.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
    const nameMatch = acc.user.fullName.toLowerCase() === cleanId;
    return (emailMatch || mobileMatch || nameMatch) && acc.password === cleanPw;
  });

  return found ? found.user : null;
}

/**
 * Update verification status of a registered account permanently.
 */
export function updateRegisteredAccountVerification(
  userId: string,
  email: string,
  status: 'not_verified' | 'pending' | 'verified' | 'rejected'
): void {
  if (typeof window === 'undefined') return;

  const accounts = getRegisteredAccounts();
  const cleanEmail = email.trim().toLowerCase();

  const index = accounts.findIndex(
    (a) =>
      a.user.id === userId ||
      (cleanEmail && a.user.email.toLowerCase() === cleanEmail)
  );

  if (index >= 0) {
    accounts[index].user.verificationStatus = status;
    if (status === 'verified') {
      accounts[index].user.isEmailVerified = true;
      accounts[index].user.isMobileVerified = true;
    }
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

/**
 * Update an existing user in registered accounts.
 */
export function updateUserAccount(updatedUser: User): void {
  if (typeof window === 'undefined') return;

  const accounts = getRegisteredAccounts();
  const cleanEmail = updatedUser.email.trim().toLowerCase();

  const index = accounts.findIndex(
    (a) =>
      a.user.id === updatedUser.id ||
      (cleanEmail && a.user.email.toLowerCase() === cleanEmail)
  );

  if (index >= 0) {
    accounts[index].user = { ...accounts[index].user, ...updatedUser };
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

/**
 * Reset password for an existing registered account by email.
 * Returns { success: true } if updated, or { success: false, error } if not found.
 */
export function resetAccountPassword(
  email: string,
  newPassword: string
): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Cannot update password outside browser.' };
  }

  const accounts = getRegisteredAccounts();
  const cleanEmail = email.trim().toLowerCase();
  const index = accounts.findIndex((a) => a.user.email.toLowerCase() === cleanEmail);

  if (index < 0) {
    return {
      success: false,
      error: 'No registered account found for this email on this device. Please sign up first.',
    };
  }

  accounts[index].password = newPassword.trim();
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  return { success: true };
}
