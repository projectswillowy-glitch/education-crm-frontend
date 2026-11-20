'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { InvoiceStatus } from '@/types/invoice';
import { backendFetch } from '@/lib/api-client';

const action = createSafeActionClient();

const createInvoiceSchema = z.object({
  billedTo: z.string().min(1, 'Billed to is required'),
  invoiceDate: z.date().optional(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  taxRate: z.number().min(0).max(1),
  serviceCharge: z.number().min(0).optional(),
  otherCharges: z.number().min(0).optional(),
});

const updateInvoiceSchema = z.object({
  id: z.string().min(1, 'Invoice ID is required'),
  billedTo: z.string().optional(),
  invoiceDate: z.date().optional(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  serviceCharge: z.number().min(0).optional(),
  otherCharges: z.number().min(0).optional(),
  status: z.nativeEnum(InvoiceStatus).optional(),
});

const deleteInvoiceSchema = z.object({
  id: z.string().min(1, 'Invoice ID is required'),
});

const createInvoiceItemSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  itemDescription: z.string().min(1, 'Item description is required'),
  quantity: z.number().min(1).optional().default(1),
  unitPrice: z.number().min(0, 'Amount must be positive'),
});

const updateInvoiceItemSchema = z.object({
  id: z.string().min(1, 'Invoice item ID is required'),
  itemDescription: z.string().optional(),
  quantity: z.number().min(1).optional(),
  unitPrice: z.number().min(0).optional(),
});

const deleteInvoiceItemSchema = z.object({
  id: z.string().min(1, 'Invoice item ID is required'),
});

const getInvoicesSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.nativeEnum(InvoiceStatus).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

const getInvoiceByIdSchema = z.object({
  id: z.string().min(1, 'Invoice ID is required'),
});

export const createInvoice = action.schema(createInvoiceSchema).action(async ({ parsedInput }) => {
  try {
    const res = await backendFetch('/api/v1/workflows/invoice-actions/createInvoice', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });

    revalidatePath('/invoices');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return { success: false, message: error.message || 'Failed to create invoice' };
  }
});

export const updateInvoice = action.schema(updateInvoiceSchema).action(async ({ parsedInput }) => {
  try {
    const res = await backendFetch('/api/v1/workflows/invoice-actions/updateInvoice', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });

    revalidatePath('/invoices');
    revalidatePath(`/invoices/${parsedInput.id}`);
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return { success: false, message: error.message || 'Failed to update invoice' };
  }
});

export const deleteInvoice = action.schema(deleteInvoiceSchema).action(async ({ parsedInput }) => {
  try {
    const res = await backendFetch('/api/v1/workflows/invoice-actions/deleteInvoice', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });

    revalidatePath('/invoices');
    revalidatePath('/dashboard');

    return res;
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return { success: false, message: error.message || 'Failed to delete invoice' };
  }
});

export const getInvoices = action.schema(getInvoicesSchema).action(async ({ parsedInput }) => {
  try {
    return await backendFetch('/api/v1/workflows/invoice-actions/getInvoices', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return { success: false, message: error.message || 'Failed to fetch invoices', data: [] };
  }
});

export const getInvoiceById = action.schema(getInvoiceByIdSchema).action(async ({ parsedInput }) => {
  try {
    return await backendFetch('/api/v1/workflows/invoice-actions/getInvoiceById', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  } catch (error: any) {
    console.error('Error fetching invoice by id:', error);
    return { success: false, message: error.message || 'Invoice not found' };
  }
});

export const addInvoiceItem = action.schema(createInvoiceItemSchema).action(async ({ parsedInput }) => {
  try {
    const res = await backendFetch('/api/v1/workflows/invoice-actions/addInvoiceItem', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });

    revalidatePath(`/invoices/${parsedInput.invoiceId}`);
    return res;
  } catch (error: any) {
    console.error('Error adding invoice item:', error);
    return { success: false, message: error.message || 'Failed to add item' };
  }
});

export const updateInvoiceItem = action.schema(updateInvoiceItemSchema).action(async ({ parsedInput }) => {
  try {
    const res = await backendFetch('/api/v1/workflows/invoice-actions/updateInvoiceItem', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });

    revalidatePath('/invoices');
    return res;
  } catch (error: any) {
    console.error('Error updating invoice item:', error);
    return { success: false, message: error.message || 'Failed to update item' };
  }
});

export const deleteInvoiceItem = action.schema(deleteInvoiceItemSchema).action(async ({ parsedInput }) => {
  try {
    const res = await backendFetch('/api/v1/workflows/invoice-actions/deleteInvoiceItem', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });

    revalidatePath('/invoices');
    return res;
  } catch (error: any) {
    console.error('Error deleting invoice item:', error);
    return { success: false, message: error.message || 'Failed to delete item' };
  }
});

export const calculateInvoiceTotals = action
  .schema(z.object({ invoiceId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    try {
      return await backendFetch('/api/v1/workflows/invoice-actions/calculateInvoiceTotals', {
        method: 'POST',
        body: JSON.stringify({ input: parsedInput }),
      });
    } catch (error: any) {
      console.error('Error calculating invoice totals:', error);
      return { success: false, message: error.message || 'Failed to calculate totals' };
    }
  });
