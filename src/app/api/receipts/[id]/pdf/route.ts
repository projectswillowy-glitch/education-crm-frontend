import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/api-client';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const query = request.nextUrl.search;
  const backendRes = await fetch(`${BACKEND_URL}/api/v1/receipts/${id}/pdf${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!backendRes.ok) {
    const errorText = await backendRes.text().catch(() => 'Failed to fetch PDF');
    return new NextResponse(errorText, {
      status: backendRes.status,
      headers: { 'Content-Type': backendRes.headers.get('content-type') || 'application/json' },
    });
  }

  const pdfBytes = await backendRes.arrayBuffer();
  const isDownload = request.nextUrl.searchParams.get('download') === 'true';
  const disposition =
    backendRes.headers.get('content-disposition') ||
    `${isDownload ? 'attachment' : 'inline'}; filename="Receipt-${id}.pdf"`;

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': disposition,
      'Cache-Control': 'no-store',
    },
  });
}

