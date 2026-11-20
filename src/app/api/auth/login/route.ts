import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { loginSchema } from '@/schema/user-schema';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0];
  if (contentType !== 'application/json') {
    return NextResponse.json({ message: 'Expected a JSON request' }, { status: 415 });
  }

  const input = loginSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
  }

  const { user } = await auth.api.signInEmail({ body: input.data });
  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
