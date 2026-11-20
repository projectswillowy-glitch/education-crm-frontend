// src/lib/auth-client.ts
'use client';

import { useState, useEffect } from 'react';
import { logoutAction } from '@/lib/actions/auth';

export interface UserSessionData {
  id: string;
  name: string;
  email: string;
  role: string | null;
  branch?: string | null;
}

type SessionData = { user: UserSessionData; session: { id: string } };

async function getSession() {
  try {
    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    if (response.ok) {
      const data: SessionData | null = await response.json();
      return { data, error: null };
    }
  } catch {}
  return { data: null, error: null };
}

export function useSession() {
  const [data, setData] = useState<SessionData | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let active = true;
    void getSession().then(({ data }) => {
      if (active) {
        setData(data);
        setIsPending(false);
      }
    });
    return () => { active = false; };
  }, []);

  return { data, isPending, error: null };
}

export const authClient = {
  useSession,
  getSession,

  signIn: {
    async email({ email, password }: { email: string; password: string }) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const result = await res.json().catch(() => null);
          return { error: { message: result?.message || 'Sign-in is unavailable. Please try again.' } };
        }
        return { error: null };
      } catch {
        return { error: { message: 'Sign-in is unavailable. Please try again.' } };
      }
    },
  },

  signOut: logoutAction,

  async changePassword({ currentPassword, newPassword }: {
    currentPassword: string;
    newPassword: string;
    revokeOtherSessions?: boolean;
  }) {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${apiUrl}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { error: { message: result.error?.message || result.message || 'Failed to change password' } };
      }
      return { data: result.data, error: null };
    } catch (e: any) {
      return { error: { message: e.message } };
    }
  },
};

export default authClient;
