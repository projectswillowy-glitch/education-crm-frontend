'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  EnquiryStatus,
  CreateEnquiryInput,
  UpdateEnquiryInput,
  EnquiryFilters,
} from '@/types/enquiry';
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

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

export async function createEnquiry(data: CreateEnquiryInput): Promise<ActionResponse> {
  try {
    const payload = {
      candidateName: data.candidateName,
      phone: data.phone,
      contact2: data.contact2 || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
      notes: data.notes || undefined,
      branchId: data.branchId || undefined,
      preferredCourseId: data.preferredCourseId || undefined,
      sourceId: data.enquirySourceId || undefined,
      serviceId: data.requiredServiceId || undefined,
      assignedToUserId: data.assignedToUserId || undefined,
    };

    const res = await backendFetch<ActionResponse>('/api/v1/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    revalidatePath('/enquiries');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error creating enquiry:', error);
    return {
      success: false,
      message: error.message || 'Failed to create enquiry',
    };
  }
}

export async function getEnquiries(filters: EnquiryFilters = {}): Promise<ActionResponse> {
  try {
    const params: Record<string, any> = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      search: filters.search || undefined,
      status: Array.isArray(filters.status) ? filters.status.join(',') : filters.status || undefined,
      branchId: filters.branchId || undefined,
      assignedToUserId: filters.assignedToUserId || undefined,
      preferredCourseId: filters.preferredCourseId || undefined,
      serviceId: filters.requiredServiceId || undefined,
      source: filters.enquirySourceId || undefined,
      startDate: filters.dateFrom ? new Date(filters.dateFrom).toISOString() : undefined,
      endDate: filters.dateTo ? new Date(filters.dateTo).toISOString() : undefined,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
    };

    return await backendFetch<ActionResponse>('/api/v1/enquiries', {
      method: 'GET',
      params,
    });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch enquiries',
    };
  }
}

export async function getEnquiry(id: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>(`/api/v1/enquiries/${id}`, {
      method: 'GET',
    });
  } catch (error: any) {
    console.error('Error fetching enquiry:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch enquiry',
    };
  }
}

export async function getEnquiryFollowUps(enquiryId: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/getEnquiryFollowUps', {
      method: 'POST',
      body: JSON.stringify({ enquiryId }),
    });
  } catch (error: any) {
    console.error('Error fetching enquiry follow-ups:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch follow-ups',
    };
  }
}

export async function getEnquiryCallLogs(enquiryId: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/getEnquiryCallLogs', {
      method: 'POST',
      body: JSON.stringify({ enquiryId }),
    });
  } catch (error: any) {
    console.error('Error fetching enquiry call logs:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch call logs',
    };
  }
}

export async function getEnquiryJobLeads(enquiryId: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/getEnquiryJobLeads', {
      method: 'POST',
      body: JSON.stringify({ enquiryId }),
    });
  } catch (error: any) {
    console.error('Error fetching enquiry job leads:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch job leads',
    };
  }
}

export async function updateEnquiry(data: UpdateEnquiryInput): Promise<ActionResponse> {
  try {
    const { id, enquirySourceId, requiredServiceId, ...rest } = data;
    const payload = {
      ...rest,
      sourceId: enquirySourceId || undefined,
      serviceId: requiredServiceId || undefined,
    };

    const res = await backendFetch<ActionResponse>(`/api/v1/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    revalidatePath('/enquiries');
    revalidatePath(`/enquiries/${id}`);
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    return {
      success: false,
      message: error.message || 'Failed to update enquiry',
    };
  }
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  notes?: string
): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>(`/api/v1/enquiries/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });

    revalidatePath('/enquiries');
    revalidatePath(`/enquiries/${id}`);
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating enquiry status:', error);
    return {
      success: false,
      message: error.message || 'Failed to update enquiry status',
    };
  }
}

export async function updateEnquiryStatusWithActivity(
  id: string,
  newStatus: EnquiryStatus,
  statusRemarks?: string
): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/updateEnquiryStatusWithActivity', {
      method: 'POST',
      body: JSON.stringify({ id, newStatus, statusRemarks }),
    });

    revalidatePath('/enquiries');
    revalidatePath(`/enquiries/${id}`);
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating enquiry status with activity:', error);
    return {
      success: false,
      message: error.message || 'Failed to update enquiry status',
    };
  }
}

export async function updateEnquiryStatusDirectToEnrolled(
  id: string,
  statusRemarks?: string
): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/updateEnquiryStatusDirectToEnrolled', {
      method: 'POST',
      body: JSON.stringify({ id, statusRemarks }),
    });

    revalidatePath('/enquiries');
    revalidatePath(`/enquiries/${id}`);
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error in direct enrollment:', error);
    return {
      success: false,
      message: error.message || 'Failed to enroll enquiry directly',
    };
  }
}

export async function assignEnquiry(
  enquiryId: string,
  assignedToUserId?: string,
  startDate?: any,
  endDate?: any,
  branchId?: string,
  name?: string,
  description?: string | null,
  remarks?: string | null
): Promise<ActionResponse> {
  return bulkAssignEnquiries(
    [enquiryId],
    assignedToUserId,
    startDate,
    endDate,
    branchId,
    name,
    description,
    remarks
  );
}

export async function bulkAssignEnquiries(
  enquiryIds: string[],
  assignedToUserId?: string,
  startDate?: any,
  endDate?: any,
  branchId?: string,
  name?: string,
  description?: string | null,
  remarks?: string | null
): Promise<ActionResponse> {
  try {
    const payload = {
      enquiryIds,
      assignedToUserId,
      branchId,
      name: name || 'Assigned Job Order',
      description: description || undefined,
      remarks: remarks || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : new Date().toISOString(),
    };

    const res = await backendFetch<ActionResponse>('/api/v1/enquiries/bulk-assign', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    revalidatePath('/enquiries');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error in bulk assignment:', error);
    return {
      success: false,
      message: error.message || 'Failed to assign enquiries in bulk',
    };
  }
}

export async function deleteEnquiry(id: string): Promise<ActionResponse> {
  try {
    await backendFetch(`/api/v1/enquiries/${id}`, {
      method: 'DELETE',
    });

    revalidatePath('/enquiries');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Enquiry deleted successfully',
    };
  } catch (error: any) {
    console.error('Error deleting enquiry:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete enquiry',
    };
  }
}

export async function bulkImportEnquiries(leads: any[], commonFields: any): Promise<ActionResponse> {
  try {
    const res = await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/bulkImportEnquiries', {
      method: 'POST',
      body: JSON.stringify({ leads, commonFields }),
    });

    revalidatePath('/enquiries');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error in bulk import:', error);
    return {
      success: false,
      message: error.message || 'Failed to import enquiries',
    };
  }
}

export async function getUsers(branchId?: string): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/enquiry/getUsers', {
      method: 'POST',
      body: JSON.stringify({ branchId }),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch users',
    };
  }
}
