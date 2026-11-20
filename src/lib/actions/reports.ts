import { ReportsData } from '@/types/reports';
import { backendFetch } from '@/lib/api-client';

export async function getReportsData(userId?: string): Promise<ReportsData> {
  try {
    return await backendFetch<ReportsData>('/api/v1/workflows/reports/getReportsData', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error('Failed to fetch reports data from backend:', error);
    return {
      stats: {
        totalEnquiries: { count: 0, trend: { value: '0%', type: 'up' } },
        newEnquiries: { count: 0, trend: { value: '0%', type: 'up' } },
        pendingFollowUps: { count: 0, trend: { value: '0%', type: 'up' } },
        todaysCalls: { count: 0, trend: { value: '0%', type: 'up' } },
      },
      statusDistribution: [],
      monthlyTrend: [],
    };
  }
}
