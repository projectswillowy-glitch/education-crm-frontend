'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { EnquiryStatus } from '@/types/enquiry';
import { backendFetch } from '@/lib/api-client';

const action = createSafeActionClient();

// Schema for creating enquiry
const createEnquirySchema = z.object({
  candidateName: z.string().min(1, 'Candidate name is required').max(100),
  phone: z.string().min(10, 'Valid phone number is required').max(15),
  contact2: z.string().optional(),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  address: z.string().optional(),
  enquirySourceId: z.string().optional(),
  branchId: z.string().optional(),
  preferredCourseId: z.string().optional(),
  requiredServiceId: z.string().optional(),
  notes: z.string().optional(),
  assignedToUserId: z.string().optional(),
  createdByUserId: z.string().optional(),
});

// Schema for updating enquiry
const updateEnquirySchema = z.object({
  id: z.string().min(1, 'Enquiry ID is required'),
  candidateName: z.string().min(1, 'Candidate name is required').max(100).optional(),
  phone: z.string().min(10, 'Valid phone number is required').max(15).optional(),
  contact2: z.string().optional(),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.nativeEnum(EnquiryStatus).optional(),
  notes: z.string().optional(),
  feedback: z.string().optional(),
  branchId: z.string().optional(),
  preferredCourseId: z.string().optional(),
  enquirySourceId: z.string().optional(),
  requiredServiceId: z.string().optional(),
});

// Schema for deleting enquiry
const deleteEnquirySchema = z.object({
  id: z.string().min(1, 'Enquiry ID is required'),
});

// Safe action for creating enquiry
export const createEnquiry = action.schema(createEnquirySchema).action(async ({ parsedInput }) => {
  try {
    const payload = {
      candidateName: parsedInput.candidateName,
      phone: parsedInput.phone,
      contact2: parsedInput.contact2 || undefined,
      email: parsedInput.email || undefined,
      address: parsedInput.address || undefined,
      notes: parsedInput.notes || undefined,
      branchId: parsedInput.branchId || undefined,
      preferredCourseId: parsedInput.preferredCourseId || undefined,
      sourceId: parsedInput.enquirySourceId || undefined,
      serviceId: parsedInput.requiredServiceId || undefined,
      assignedToUserId: parsedInput.assignedToUserId || undefined,
    };

    const result = await backendFetch<{ success: boolean; data: any }>('/api/v1/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    revalidatePath('/enquiries');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: result.data,
      message: 'Enquiry created successfully',
    };
  } catch (error: any) {
    console.error('Error in createEnquiry action:', error);
    return {
      success: false,
      message: error.message || 'Failed to create enquiry',
    };
  }
});

// Safe action for updating enquiry
export const updateEnquiry = action.schema(updateEnquirySchema).action(async ({ parsedInput }) => {
  try {
    const { id, enquirySourceId, requiredServiceId, ...rest } = parsedInput;
    const payload = {
      ...rest,
      sourceId: enquirySourceId || undefined,
      serviceId: requiredServiceId || undefined,
    };

    const result = await backendFetch<{ success: boolean; data: any }>(`/api/v1/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    revalidatePath('/enquiries');
    revalidatePath(`/enquiries/${id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      data: result.data,
      message: 'Enquiry updated successfully',
    };
  } catch (error: any) {
    console.error('Error in updateEnquiry action:', error);
    return {
      success: false,
      message: error.message || 'Failed to update enquiry',
    };
  }
});

// Safe action for deleting enquiry
export const deleteEnquiry = action.schema(deleteEnquirySchema).action(async ({ parsedInput }) => {
  try {
    await backendFetch(`/api/v1/enquiries/${parsedInput.id}`, {
      method: 'DELETE',
    });

    revalidatePath('/enquiries');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Enquiry deleted successfully',
    };
  } catch (error: any) {
    console.error('Error in deleteEnquiry action:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete enquiry',
    };
  }
});

export const getBranches = action.schema(z.object({})).action(async () => {
  try {
    return await backendFetch('/api/v1/workflows/enquiry-action/getBranches', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
});

export const getCourses = action.schema(z.object({})).action(async () => {
  try {
    return await backendFetch('/api/v1/workflows/enquiry-action/getCourses', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
});

export const getEnquirySources = action.schema(z.object({})).action(async () => {
  try {
    return await backendFetch('/api/v1/workflows/enquiry-action/getEnquirySources', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
});

export const getRequiredServices = action.schema(z.object({})).action(async () => {
  try {
    return await backendFetch('/api/v1/workflows/enquiry-action/getRequiredServices', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
});

export const getUsers = action
  .schema(z.object({ branchId: z.string().optional() }))
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/enquiry-action/getUsers', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      return { success: false, data: [] };
    }
  });
