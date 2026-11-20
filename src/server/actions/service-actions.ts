'use server';

import { revalidatePath } from 'next/cache';
import {
  CreateServiceBilling,
  UpdateServiceBilling,
  PayServiceBilling,
  DeleteServiceBilling,
  ServiceBilling,
  ServiceBillItem,
} from '@/types/service-billing';
import { backendFetch } from '@/lib/api-client';

interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export async function listServiceBilling(
  page = 1,
  pageSize = 10,
  searchQuery = '',
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  serviceId = 'all',
  courseId = 'all'
): Promise<ActionResponse<ServiceBilling[]>> {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/listServiceBilling', {
      method: 'POST',
      body: JSON.stringify({ page, pageSize, searchQuery, sortBy, sortOrder, serviceId, courseId }),
    });
  } catch (error: any) {
    console.error('Error listing service billings:', error);
    return { success: false, message: error.message || 'Failed to list service billings', data: [] };
  }
}

export async function createServiceBilling(
  input: CreateServiceBilling
): Promise<ActionResponse<ServiceBilling | null>> {
  try {
    const res = await backendFetch<ActionResponse<ServiceBilling | null>>('/api/v1/workflows/service-actions/createServiceBilling', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    revalidatePath('/service-billing');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error creating service billing:', error);
    return { success: false, message: error.message || 'Failed to create service billing', data: null };
  }
}

export async function updateServiceBilling(
  input: UpdateServiceBilling
): Promise<ActionResponse<ServiceBilling | null>> {
  try {
    const res = await backendFetch<ActionResponse<ServiceBilling | null>>('/api/v1/workflows/service-actions/updateServiceBilling', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    revalidatePath('/service-billing');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating service billing:', error);
    return { success: false, message: error.message || 'Failed to update service billing', data: null };
  }
}

export async function getServiceBillHistory(
  id: string
): Promise<ActionResponse<ServiceBillItem[]>> {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/getServiceBillHistory', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    console.error('Error getting history:', error);
    return { success: false, message: error.message || 'Failed to get history', data: [] };
  }
}

export async function payServiceBilling(
  input: PayServiceBilling
): Promise<ActionResponse<ServiceBilling | null>> {
  try {
    const res = await backendFetch<ActionResponse<ServiceBilling | null>>('/api/v1/workflows/service-actions/payServiceBilling', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    revalidatePath('/service-billing');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return { success: false, message: error.message || 'Failed to process payment', data: null };
  }
}

export async function getServiceBillByStudentId(
  studentId: string
): Promise<ActionResponse<ServiceBilling | null>> {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/getServiceBillByStudentId', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
  } catch (error: any) {
    console.error('Error getting student bill:', error);
    return { success: false, message: error.message || 'Failed to get student bill', data: null };
  }
}

export async function deleteServiceBilling(
  input: DeleteServiceBilling
): Promise<ActionResponse<boolean>> {
  try {
    const res = await backendFetch<ActionResponse<boolean>>('/api/v1/workflows/service-actions/deleteServiceBilling', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    revalidatePath('/service-billing');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error deleting service billing:', error);
    return { success: false, message: error.message || 'Failed to delete service billing', data: false };
  }
}

export async function listStudents(): Promise<ActionResponse<{ id: string; candidateName: string }[]>> {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/listStudents', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

export async function listServices(): Promise<ActionResponse<{ id: string; name: string; price: number }[]>> {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/listServices', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

export async function totalListing(): Promise<ActionResponse<{ total: number }>> {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/totalListing', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: { total: 0 } };
  }
}

export async function getServiceBillById(id: string) {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/getServiceBillById', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getServicesByIds(ids: string[]) {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/getServicesByIds', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  } catch (error: any) {
    return { success: false, message: error.message, data: [] };
  }
}

export async function getAdmissionHistoryById(id: string) {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/getAdmissionHistoryById', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getServiceBillDetailsForPDF(id: string) {
  try {
    return await backendFetch('/api/v1/workflows/service-actions/getServiceBillDetailsForPDF', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
