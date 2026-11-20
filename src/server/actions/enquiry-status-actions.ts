'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { EnquiryStatus } from '@/types/enquiry';
import { backendFetch } from '@/lib/api-client';

const action = createSafeActionClient();

// Schema for status update with activity
const statusUpdateSchema = z.object({
  id: z.string().min(1, 'Enquiry ID is required'),
  newStatus: z.nativeEnum(EnquiryStatus),
  statusRemarks: z.string().optional(),
});

// Schema for direct enrollment
const directEnrollmentSchema = z.object({
  id: z.string().min(1, 'Enquiry ID is required'),
  statusRemarks: z.string().min(1, 'Status remarks are required for direct enrollment'),
});

// Safe action for updating enquiry status with activity log
export const updateEnquiryStatusWithActivity = action
  .schema(statusUpdateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch('/api/v1/workflows/enquiry-status-actions/updateEnquiryStatusWithActivity', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath('/enquiries');
      revalidatePath(`/enquiries/${parsedInput.id}`);
      revalidatePath('/dashboard');

      return res;
    } catch (error: any) {
      console.error('Error updating enquiry status with activity:', error);
      return {
        success: false,
        message: error.message || 'Failed to update enquiry status',
      };
    }
  });

// Safe action for direct enrollment from NEW to ENROLLED
export const updateEnquiryStatusDirectToEnrolled = action
  .schema(directEnrollmentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch('/api/v1/workflows/enquiry-status-actions/updateEnquiryStatusDirectToEnrolled', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath('/enquiries');
      revalidatePath(`/enquiries/${parsedInput.id}`);
      revalidatePath('/dashboard');

      return res;
    } catch (error: any) {
      console.error('Error in direct enrollment:', error);
      return {
        success: false,
        message: error.message || 'Failed to enroll enquiry directly',
      };
    }
  });
