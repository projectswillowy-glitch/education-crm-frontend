'use server';

import { ActivityFilters } from '@/types/enquiry-activity';
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

export async function getEnquiryActivities(filters: ActivityFilters = {}): Promise<ActionResponse> {
  try {
    if (filters.enquiryId) {
      const res = await backendFetch<{ success: boolean; data: any[] }>(`/api/v1/enquiries/${filters.enquiryId}/activities`);
      return {
        success: true,
        message: 'Activities fetched successfully',
        data: res.data || [],
      };
    }
    return {
      success: true,
      message: 'No activities found',
      data: [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch activities',
    };
  }
}

export async function getActivitiesForEnquiry(enquiryId: string): Promise<ActionResponse> {
  return getEnquiryActivities({ enquiryId });
}
