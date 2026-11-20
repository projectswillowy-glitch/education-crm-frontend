"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { actionClient, adminActionClient } from "@/lib/safe-action";
import { backendFetch } from "@/lib/api-client";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export const createAdmission = actionClient
  .schema(z.any())
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch<any>('/api/v1/workflows/admission-actions/createAdmission', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath("/admissions");
      revalidatePath("/dashboard");
      return res;
    } catch (error: any) {
      console.error("Error creating admission:", error);
      return { success: false, message: error.message || "Failed to create admission" };
    }
  });

export const updateAdmission = adminActionClient
  .schema(z.any())
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch<any>('/api/v1/workflows/admission-actions/updateAdmission', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath("/admissions");
      if (parsedInput?.id) {
        revalidatePath(`/admissions/${parsedInput.id}`);
      }
      revalidatePath("/dashboard");
      return res;
    } catch (error: any) {
      console.error("Error updating admission:", error);
      return { success: false, message: error.message || "Failed to update admission" };
    }
  });

export const deleteAdmission = adminActionClient
  .schema(z.any())
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch<any>('/api/v1/workflows/admission-actions/deleteAdmission', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath("/admissions");
      revalidatePath("/dashboard");
      return res;
    } catch (error: any) {
      console.error("Error deleting admission:", error);
      return { success: false, message: error.message || "Failed to delete admission" };
    }
  });

export const getAdmissions = actionClient
  .schema(z.any())
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch<any>('/api/v1/workflows/admission-actions/getAdmissions', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      console.error("Error fetching admissions:", error);
      return { success: false, message: error.message || "Failed to fetch admissions", data: [] };
    }
  });

export const getAdmissionById = actionClient
  .schema(z.any())
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch<any>('/api/v1/workflows/admission-actions/getAdmissionById', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      console.error("Error fetching admission by ID:", error);
      return { success: false, message: error.message || "Failed to fetch admission" };
    }
  });

export const getAdmissionsByEnquiry = actionClient
  .schema(z.any())
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch<any>('/api/v1/workflows/admission-actions/getAdmissionsByEnquiry', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      console.error("Error fetching admissions by enquiry:", error);
      return { success: false, message: error.message || "Failed to fetch admissions", data: [] };
    }
  });

export const getEnquirySourcesForAdmission = actionClient.action(async () => {
  try {
    return await backendFetch<any>('/api/v1/workflows/admission-actions/getEnquirySourcesForAdmission', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
});

export const getCoursesForAdmission = actionClient.action(async () => {
  try {
    return await backendFetch<any>('/api/v1/workflows/admission-actions/getCoursesForAdmission', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
});
