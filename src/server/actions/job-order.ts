'use server';

import { revalidatePath } from 'next/cache';
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

export type CreateJobOrderInput = {
  title: string;
  description?: string;
  branchId?: string;
  managerId?: string;
  enquiryIds: string[];
};

export async function createJobOrder(input: CreateJobOrderInput): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/job-order/createJobOrder', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    revalidatePath('/enquiries/job-orders/pending');
    revalidatePath('/enquiries/job-orders/completed');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error creating job order:', error);
    return { success: false, message: error.message || 'Failed to create job order' };
  }
}

export async function getJobOrders(filters?: {
  branchId?: string;
  managerId?: string;
  status?: 'PENDING' | 'CLOSED';
  search?: string;
  page?: number;
  limit?: number;
  completedOnly?: boolean;
  pendingOnly?: boolean;
  dueOnly?: boolean;
}): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/job-order/getJobOrders', {
      method: 'POST',
      body: JSON.stringify({ filters }),
    });
  } catch (error: any) {
    console.error('Error fetching job orders:', error);
    return { success: false, message: error.message || 'Failed to fetch job orders' };
  }
}

export async function getJobOrder(id: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/job-order/getJobOrder', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    console.error('Error fetching job order:', error);
    return { success: false, message: error.message || 'Failed to fetch job order' };
  }
}

export async function updateJobLeadStatus(
  jobLeadId: string,
  status: 'PENDING' | 'CLOSED'
): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/job-order/updateJobLeadStatus', {
      method: 'POST',
      body: JSON.stringify({ jobLeadId, status }),
    });

    revalidatePath('/enquiries/job-orders/pending');
    revalidatePath('/enquiries/job-orders/completed');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating job lead status:', error);
    return { success: false, message: error.message || 'Failed to update status' };
  }
}

export async function getJobOrderStats(jobId: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/job-order/getJobOrderStats', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  } catch (error: any) {
    console.error('Error getting job order stats:', error);
    return { success: false, message: error.message || 'Failed to get stats' };
  }
}

export async function deleteJobOrder(id: string): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/job-order/deleteJobOrder', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    revalidatePath('/enquiries/job-orders/pending');
    revalidatePath('/enquiries/job-orders/completed');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error deleting job order:', error);
    return { success: false, message: error.message || 'Failed to delete job order' };
  }
}

export async function reassignJobOrder(
  id: string,
  newManagerId: string
): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/job-order/reassignJobOrder', {
      method: 'POST',
      body: JSON.stringify({ id, newManagerId }),
    });

    revalidatePath('/enquiries/job-orders/pending');
    revalidatePath('/enquiries/job-orders/completed');

    return res;
  } catch (error: any) {
    console.error('Error reassigning job order:', error);
    return { success: false, message: error.message || 'Failed to reassign job order' };
  }
}

export async function getJobLead(id: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/job-order/getJobLead', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    console.error('Error getting job lead:', error);
    return { success: false, message: error.message || 'Failed to get job lead' };
  }
}
