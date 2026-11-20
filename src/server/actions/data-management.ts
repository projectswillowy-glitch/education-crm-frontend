'use server';

import { revalidatePath } from 'next/cache';
import {
  CreateRoleInput,
  CreateCourseInput,
  CreateBranchInput,
  CreateEnquirySourceInput,
  DeleteInput,
  CreateServiceInput,
  UpdateServiceInput,
} from '@/types/data-management';
import { backendFetch } from '@/lib/api-client';

export type RoleInput = CreateRoleInput;
export type CourseInput = CreateCourseInput;
export type BranchInput = CreateBranchInput;
export type EnquirySourceInput = CreateEnquirySourceInput;

interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export async function getAllRoles(): Promise<ActionResponse> {
  return backendFetch('/api/v1/workflows/data-management/getAllRoles', { method: 'POST', body: JSON.stringify({}) });
}

export async function createRole(input: RoleInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/createRole', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function updateRole(input: RoleInput & { id: string }): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/updateRole', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function deleteRole(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/deleteRole', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function getAllCourses(): Promise<ActionResponse> {
  return backendFetch('/api/v1/workflows/data-management/getAllCourses', { method: 'POST', body: JSON.stringify({}) });
}

export async function createCourse(input: CourseInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/createCourse', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function updateCourse(input: CourseInput & { id: string }): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/updateCourse', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function deleteCourse(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/deleteCourse', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function toggleCourseStatus(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/toggleCourseStatus', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function getAllBranches(): Promise<ActionResponse> {
  return backendFetch('/api/v1/workflows/data-management/getAllBranches', { method: 'POST', body: JSON.stringify({}) });
}

export async function createBranch(input: BranchInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/createBranch', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function updateBranch(input: BranchInput & { id: string }): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/updateBranch', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function deleteBranch(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/deleteBranch', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function toggleBranchStatus(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/toggleBranchStatus', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function getAllEnquirySources(): Promise<ActionResponse> {
  return backendFetch('/api/v1/workflows/data-management/getAllEnquirySources', { method: 'POST', body: JSON.stringify({}) });
}

export async function createEnquirySource(input: EnquirySourceInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/createEnquirySource', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function updateEnquirySource(input: EnquirySourceInput & { id: string }): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/updateEnquirySource', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function deleteEnquirySource(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/deleteEnquirySource', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function toggleEnquirySourceStatus(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/toggleEnquirySourceStatus', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function getAllRequiredServices(): Promise<ActionResponse> {
  return backendFetch('/api/v1/workflows/data-management/getAllRequiredServices', { method: 'POST', body: JSON.stringify({}) });
}

export async function getAllServices(): Promise<ActionResponse> {
  return backendFetch('/api/v1/workflows/data-management/getAllServices', { method: 'POST', body: JSON.stringify({}) });
}

export async function createService(input: CreateServiceInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/createService', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function updateService(input: UpdateServiceInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/updateService', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function deleteService(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/deleteService', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function createRequiredService(input: { name: string; description?: string }): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/createRequiredService', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function updateRequiredService(input: { id: string; name: string; description?: string }): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/updateRequiredService', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}

export async function deleteRequiredService(input: DeleteInput): Promise<ActionResponse> {
  const res = await backendFetch<ActionResponse>('/api/v1/workflows/data-management/deleteRequiredService', {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
  revalidatePath('/admin/data-management');
  return res;
}
