'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { ActivityType } from '@/types/enquiry-activity';
import { backendFetch } from '@/lib/api-client';

const action = createSafeActionClient();

const getActivitiesSchema = z.object({
  enquiryId: z.string().min(1, 'Enquiry ID is required'),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(50),
  type: z.array(z.nativeEnum(ActivityType)).optional(),
});

export const getEnquiryActivities = action
  .schema(getActivitiesSchema)
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/enquiry-activity-actions/getEnquiryActivities', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      console.error('Error in getEnquiryActivities action:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch enquiry activities',
      };
    }
  });
