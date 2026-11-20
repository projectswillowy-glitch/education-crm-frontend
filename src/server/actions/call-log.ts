'use server';

import { revalidatePath } from 'next/cache';
import { CreateCallLogInput, CallLogFilters } from '@/types/enquiry';
import { backendFetch } from '@/lib/api-client';

interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function createCallLog(data: CreateCallLogInput): Promise<ActionResponse> {
  try {
    const result = await backendFetch<ActionResponse>('/api/v1/workflows/call-log/createCallLog', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    if (result.success) {
      revalidatePath('/enquiries');
      revalidatePath(`/enquiries/${data.enquiryId}`);
      revalidatePath('/call-register');
      revalidatePath('/dashboard');
    }

    return result;
  } catch (error: any) {
    console.error('Error creating call log:', error);
    return {
      success: false,
      message: error.message || 'Failed to create call log',
    };
  }
}

export async function getCallLogs(filters: CallLogFilters = {}): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/call-log/getCallLogs', {
      method: 'POST',
      body: JSON.stringify({ filters }),
    });
  } catch (error: any) {
    console.error('Error fetching call logs:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch call logs',
    };
  }
}

export async function deleteCallLog(id: string): Promise<ActionResponse> {
  try {
    const result = await backendFetch<ActionResponse>('/api/v1/workflows/call-log/deleteCallLog', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    if (result.success) {
      revalidatePath('/enquiries');
      revalidatePath('/call-register');
      revalidatePath('/dashboard');
    }

    return result;
  } catch (error: any) {
    console.error('Error deleting call log:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete call log',
    };
  }
}
