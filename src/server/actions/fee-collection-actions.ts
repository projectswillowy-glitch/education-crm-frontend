'use server';

import { revalidatePath } from 'next/cache';
import { CreateReceiptInput, UpdateReceiptInput } from '@/types/fee-collection';
import { backendFetch } from '@/lib/api-client';

export async function createReceipt(data: CreateReceiptInput) {
  try {
    const res = await backendFetch('/api/v1/workflows/fee-collection-actions/createReceipt', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    revalidatePath(`/admissions/${data.admissionId}`);
    revalidatePath('/receipts');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error creating receipt:', error);
    return { success: false, message: error.message || 'Failed to create receipt' };
  }
}

export async function updateReceipt(data: UpdateReceiptInput) {
  try {
    const res = await backendFetch('/api/v1/workflows/fee-collection-actions/updateReceipt', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    revalidatePath('/receipts');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating receipt:', error);
    return { success: false, message: error.message || 'Failed to update receipt' };
  }
}

export async function deleteReceipt(id: string) {
  try {
    const res = await backendFetch('/api/v1/workflows/fee-collection-actions/deleteReceipt', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    revalidatePath('/receipts');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error deleting receipt:', error);
    return { success: false, message: error.message || 'Failed to delete receipt' };
  }
}

export async function getReceiptsByAdmissionId(admissionId: string) {
  try {
    return await backendFetch('/api/v1/workflows/fee-collection-actions/getReceiptsByAdmissionId', {
      method: 'POST',
      body: JSON.stringify({ admissionId }),
    });
  } catch (error: any) {
    console.error('Error fetching receipts:', error);
    return { success: false, message: error.message || 'Failed to fetch receipts', data: [] };
  }
}

export async function getAdmissionWithFeeDetails(admissionId: string) {
  try {
    return await backendFetch('/api/v1/workflows/fee-collection-actions/getAdmissionWithFeeDetails', {
      method: 'POST',
      body: JSON.stringify({ admissionId }),
    });
  } catch (error: any) {
    console.error('Error fetching admission fee details:', error);
    return { success: false, message: error.message || 'Failed to fetch admission fee details' };
  }
}
