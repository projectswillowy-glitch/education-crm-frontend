import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000';

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return (
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('crm_session')?.value ||
      cookieStore.get('token')?.value ||
      null
    );
  } catch {
    return null;
  }
}

export interface ApiFetchOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function backendFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token: explicitToken, params, headers: customHeaders, ...rest } = options;
  const token = explicitToken ?? (await getAuthToken());

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${BACKEND_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    }
    const qStr = query.toString();
    if (qStr) {
      url += (url.includes('?') ? '&' : '?') + qStr;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error?.message || data?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}

export default backendFetch;

