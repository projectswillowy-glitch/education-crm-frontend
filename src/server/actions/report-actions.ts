'use server';

import { z } from 'zod';
import { adminActionClient, executiveActionClient } from '@/lib/safe-action';
import { backendFetch } from '@/lib/api-client';

const dateRangeSchema = z.object({
  from: z.date(),
  to: z.date(),
});

const reportFiltersSchema = z.object({
  dateRange: dateRangeSchema.optional(),
  branchId: z.string().optional(),
  courseId: z.string().optional(),
  userId: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

export const getTelecallerPerformanceReport = adminActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getTelecallerPerformanceReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getTelecallerEnquiryStats = adminActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getTelecallerEnquiryStats', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getTelecallerConversionRates = adminActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getTelecallerConversionRates', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getBranchPerformanceReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getBranchPerformanceReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getBranchAdmissionStats = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getBranchAdmissionStats', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getAdmissionPaymentReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getAdmissionPaymentReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getExpenseReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getExpenseReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getInvoiceReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getInvoiceReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getIncomeReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getIncomeReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getPendingPaymentReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getPendingPaymentReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const exportTelecallerReportCSV = adminActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/exportTelecallerReportCSV', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const exportFinancialReportCSV = executiveActionClient
  .schema(
    z.object({
      reportType: z.enum(['admission-payment', 'expense', 'invoice', 'income', 'pending-payment']),
      filters: reportFiltersSchema,
    })
  )
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/exportFinancialReportCSV', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getReportDashboardData = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getReportDashboardData', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });

export const getBranchReport = executiveActionClient
  .schema(reportFiltersSchema)
  .action(async ({ parsedInput }) => {
    return backendFetch('/api/v1/workflows/report-actions/getBranchReport', {
      method: 'POST',
      body: JSON.stringify({ input: parsedInput }),
    });
  });
