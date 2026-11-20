import { cookies } from 'next/headers';
import { cache } from 'react';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'crm_elevate_super_secure_jwt_secret_key_2026';
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000';

export const sessionCookie = 'auth_token';
export const legacySessionCookie = 'crm_session';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string | null;
  branch?: string | null;
  permissions?: string[];
}

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string | null;
  branch?: string | null;
  permissions?: string[];
  authVersion?: number;
  exp?: number;
  iat?: number;
}

export async function getSessionFromToken(token?: string) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    if (!decoded || !decoded.id) return null;

    const user: UserSession = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role ?? null,
      branch: decoded.branch ?? null,
      permissions: decoded.permissions ?? [],
    };

    return {
      user,
      session: {
        id: decoded.id,
        userId: decoded.id,
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 86400000),
      },
    };
  } catch {
    return null;
  }
}

const getSession = cache(async () => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get(sessionCookie)?.value ||
    cookieStore.get(legacySessionCookie)?.value ||
    cookieStore.get('token')?.value;

  return getSessionFromToken(token);
});

export const auth = {
  api: {
    getSession(_options?: { headers?: Headers }) {
      return getSession();
    },

    async signInEmail({ body }: { body: { email: string; password: string } }) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: body.email, password: body.password }),
          cache: 'no-store',
        });

        const resData = await response.json();
        if (!response.ok || !resData.success || !resData.data?.token) {
          return { user: null, message: resData.error?.message || 'Invalid email or password' };
        }

        const { token, user } = resData.data;
        const cookieStore = await cookies();
        const maxAge = 7 * 24 * 60 * 60; // 7 days

        cookieStore.set(sessionCookie, token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge,
        });

        cookieStore.set(legacySessionCookie, token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge,
        });

        cookieStore.set('token', token, {
          httpOnly: false,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge,
        });

        cookieStore.set('user', encodeURIComponent(JSON.stringify(user)), {
          httpOnly: false,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge,
        });

        return { user };
      } catch (err) {
        console.error('Error signing in through backend:', err);
        return { user: null, message: 'Backend connection failed' };
      }
    },

    async signOut() {
      const cookieStore = await cookies();
      const token = cookieStore.get(sessionCookie)?.value || cookieStore.get(legacySessionCookie)?.value;

      if (token) {
        try {
          await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
        } catch {}
      }

      cookieStore.delete(sessionCookie);
      cookieStore.delete(legacySessionCookie);
      cookieStore.delete('token');
      cookieStore.delete('user');
    },

    async createUser({
      body,
    }: {
      body: {
        name: string;
        email: string;
        password: string;
        role: string;
        data?: { branch?: string };
        branch?: string;
      };
    }) {
      const cookieStore = await cookies();
      const token = cookieStore.get(sessionCookie)?.value;

      const response = await fetch(`${BACKEND_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          password: body.password,
          role: body.role,
          branch: body.data?.branch || body.branch,
        }),
        cache: 'no-store',
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error?.message || 'Failed to create user');
      }

      return { user: res.data };
    },
  },
};

export default auth;
