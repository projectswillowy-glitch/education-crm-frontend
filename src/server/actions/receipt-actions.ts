'use server';

import { backendFetch } from '@/lib/api-client';

export async function getReceiptById(id: string) {
  try {
    return await backendFetch('/api/v1/workflows/receipt-actions/getReceiptById', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    console.error('Error fetching receipt:', error);
    return null;
  }
}

export async function getReceiptWithAdmissionData(receiptId: string) {
  try {
    return await backendFetch('/api/v1/workflows/receipt-actions/getReceiptWithAdmissionData', {
      method: 'POST',
      body: JSON.stringify({ receiptId }),
    });
  } catch (error: any) {
    console.error('Error fetching receipt with admission data:', error);
    return null;
  }
}
