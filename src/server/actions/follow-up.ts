'use server';

import { revalidatePath } from 'next/cache';
import { CreateFollowUpInput, UpdateFollowUpInput, FollowUpFilters } from '@/types/enquiry';
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

export async function createFollowUp(data: CreateFollowUpInput): Promise<ActionResponse> {
  try {
    const result = await backendFetch<ActionResponse>('/api/v1/workflows/follow-up/createFollowUp', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    if (result.success) {
      revalidatePath('/enquiries');
      revalidatePath(`/enquiries/${data.enquiryId}`);
      revalidatePath('/follow-ups');
      revalidatePath('/dashboard');
    }

    return result;
  } catch (error: any) {
    console.error('Error creating follow-up:', error);
    return {
      success: false,
      message: error.message || 'Failed to create follow-up',
    };
  }
}

export async function getFollowUps(filters: FollowUpFilters = {}): Promise<ActionResponse> {
  try {
    return await backendFetch<ActionResponse>('/api/v1/workflows/follow-up/getFollowUps', {
      method: 'POST',
      body: JSON.stringify({ filters }),
    });
  } catch (error: any) {
    console.error('Error fetching follow-ups:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch follow-ups',
    };
  }
}

export async function updateFollowUp(data: UpdateFollowUpInput): Promise<ActionResponse> {
  try {
    const result = await backendFetch<ActionResponse>('/api/v1/workflows/follow-up/updateFollowUp', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    if (result.success) {
      revalidatePath('/enquiries');
      revalidatePath('/follow-ups');
      revalidatePath('/dashboard');
    }

    return result;
  } catch (error: any) {
    console.error('Error updating follow-up:', error);
    return {
      success: false,
      message: error.message || 'Failed to update follow-up',
    };
  }
}

export async function deleteFollowUp(id: string): Promise<ActionResponse> {
  try {
    const result = await backendFetch<ActionResponse>('/api/v1/workflows/follow-up/deleteFollowUp', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    if (result.success) {
      revalidatePath('/enquiries');
      revalidatePath('/follow-ups');
      revalidatePath('/dashboard');
    }

    return result;
  } catch (error: any) {
    console.error('Error deleting follow-up:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete follow-up',
    };
  }
}
