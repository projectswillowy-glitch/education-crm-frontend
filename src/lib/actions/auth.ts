// src/actions/auth.ts
'use server';

import { actionClient, adminActionClient } from '@/lib/safe-action';
import { auth } from '@/lib/auth';
import { returnValidationErrors } from 'next-safe-action';
import { redirect } from 'next/navigation';
import { loginSchema, userFormSchema } from '@/schema/user-schema';
import { backendFetch } from '@/lib/api-client';
import { z } from 'zod';

// Create user action
export const createUserAction = adminActionClient
  .inputSchema(userFormSchema)
  .action(async ({ parsedInput: { name, email, password, role, branch } }) => {
    try {
      const { user } = await auth.api.createUser({
        body: {
          name,
          email,
          password,
          role,
          branch,
        },
      });

      return {
        success: true,
        message: 'User created successfully',
        user,
      };
    } catch (err: any) {
      return returnValidationErrors(userFormSchema, {
        _errors: [err.message || 'Failed to create user'],
      });
    }
  });

// Update user branch action
export const updateUserBranchAction = adminActionClient
  .inputSchema(
    z.object({
      userId: z.string(),
      branchId: z.string(),
    })
  )
  .action(async ({ parsedInput: { userId, branchId } }) => {
    try {
      await backendFetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ branch: branchId }),
      });

      return {
        success: true,
        message: 'User branch updated successfully',
      };
    } catch (error: any) {
      console.error('Update user branch error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user branch',
      };
    }
  });

// Update user role action
export const updateUserRoleAction = adminActionClient
  .inputSchema(
    z.object({
      userId: z.string(),
      role: z.string(),
    })
  )
  .action(async ({ parsedInput: { userId, role } }) => {
    try {
      await backendFetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });

      return {
        success: true,
        message: `User role updated to ${role.toUpperCase()}`,
      };
    } catch (error: any) {
      console.error('Update user role error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user role',
      };
    }
  });

// Delete user action
export const deleteUserAction = adminActionClient
  .inputSchema(
    z.object({
      userId: z.string(),
    })
  )
  .action(async ({ parsedInput: { userId } }) => {
    try {
      await backendFetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
      });

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error: any) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete user',
      };
    }
  });

// Update profile action
export const updateProfileAction = actionClient
  .inputSchema(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
    })
  )
  .action(async ({ parsedInput: { name, email } }) => {
    try {
      const session = await auth.api.getSession();

      if (!session) {
        return {
          success: false,
          message: 'Unauthorized',
        };
      }

      await backendFetch(`/api/v1/users/${session.user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, email }),
      });

      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile',
      };
    }
  });

// Login action
export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const signInResult = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      if (!signInResult.user) {
        return returnValidationErrors(loginSchema, {
          _errors: [signInResult.message || 'Invalid email or password'],
        });
      }

      return {
        success: true,
        message: 'Login successful',
        data: signInResult.user,
        redirectTo: '/dashboard',
      };
    } catch (error) {
      console.error('Login error:', error);
      return returnValidationErrors(loginSchema, {
        _errors: ['Invalid email or password'],
      });
    }
  });

// Logout action
export const logoutAction = actionClient.action(async () => {
  await auth.api.signOut();
  redirect('/login');
});

export const getAllUsers = async () => {
  const session = await auth.api.getSession();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  const res = await backendFetch<{ success: boolean; data: any[] }>('/api/v1/users');
  return res.data || [];
};

export const getAllRoles = async () => {
  const res = await backendFetch<{ success: boolean; data: any[] }>('/api/v1/roles');
  return res.data || [];
};

export const getAllBranches = async () => {
  const res = await backendFetch<{ success: boolean; data: any[] }>('/api/v1/branches');
  return res.data || [];
};
