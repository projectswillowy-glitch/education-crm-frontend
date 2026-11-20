'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient } from '@/lib/safe-action';
import {
  createExpenseSchema,
  updateExpenseSchema,
  deleteExpenseSchema,
  getExpenseSchema,
  getExpensesSchema,
  duplicateExpenseSchema,
} from '@/schema/expense-schema';
import { backendFetch } from '@/lib/api-client';
import { z } from 'zod';

export const createExpenseAction = authActionClient
  .inputSchema(createExpenseSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch('/api/v1/workflows/expense-actions/createExpenseAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath('/expenses');
      revalidatePath('/dashboard');

      return res;
    } catch (error: any) {
      console.error('Failed to create expense:', error);
      return { success: false, error: error.message || 'Failed to create expense' };
    }
  });

export const updateExpenseAction = authActionClient
  .inputSchema(updateExpenseSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch('/api/v1/workflows/expense-actions/updateExpenseAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath('/expenses');
      revalidatePath(`/expenses/${parsedInput.id}`);
      revalidatePath('/dashboard');

      return res;
    } catch (error: any) {
      console.error('Failed to update expense:', error);
      return { success: false, error: error.message || 'Failed to update expense' };
    }
  });

export const deleteExpenseAction = authActionClient
  .inputSchema(deleteExpenseSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch('/api/v1/workflows/expense-actions/deleteExpenseAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath('/expenses');
      revalidatePath('/dashboard');

      return res;
    } catch (error: any) {
      console.error('Failed to delete expense:', error);
      return { success: false, error: error.message || 'Failed to delete expense' };
    }
  });

export const getExpensesAction = authActionClient
  .inputSchema(getExpensesSchema.optional())
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/expense-actions/getExpensesAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput || {} }),
      });
    } catch (error: any) {
      console.error('Failed to get expenses:', error);
      return { success: false, error: error.message || 'Failed to fetch expenses', data: [] };
    }
  });

export const getExpenseByIdAction = authActionClient
  .inputSchema(getExpenseSchema)
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/expense-actions/getExpenseByIdAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      console.error('Failed to get expense by id:', error);
      return { success: false, error: error.message || 'Expense not found' };
    }
  });

export const getExpensesByUserAction = authActionClient
  .inputSchema(z.object({ userId: z.string().cuid(), page: z.number().int().positive().optional(), limit: z.number().int().positive().optional() }))
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/expense-actions/getExpensesByUserAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      return { success: false, error: error.message, data: [] };
    }
  });

export const getExpensesByDateRangeAction = authActionClient
  .inputSchema(z.object({ startDate: z.coerce.date(), endDate: z.coerce.date(), page: z.number().int().positive().optional(), limit: z.number().int().positive().optional() }))
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/expense-actions/getExpensesByDateRangeAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      return { success: false, error: error.message, data: [] };
    }
  });

export const getExpensesByCategoryAction = authActionClient
  .inputSchema(z.object({ category: z.string(), page: z.number().int().positive().optional(), limit: z.number().int().positive().optional() }))
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/expense-actions/getExpensesByCategoryAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      return { success: false, error: error.message, data: [] };
    }
  });

export const duplicateExpenseAction = authActionClient
  .inputSchema(duplicateExpenseSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await backendFetch('/api/v1/workflows/expense-actions/duplicateExpenseAction', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });

      revalidatePath('/expenses');
      revalidatePath('/dashboard');

      return res;
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to duplicate expense' };
    }
  });
