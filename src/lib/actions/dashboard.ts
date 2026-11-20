import { DashboardData } from '@/types/dashboard';
import { backendFetch } from '@/lib/api-client';

export async function getDashboardData(
  userId?: string,
  userRole?: string,
  userBranch?: string
): Promise<DashboardData> {
  try {
    return await backendFetch<DashboardData>('/api/v1/workflows/dashboard/getDashboardData', {
      method: 'POST',
      body: JSON.stringify({ userId, userRole, userBranch }),
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data from backend:', error);
    return {
      stats: {
        totalEnquiries: 0,
        newEnquiries: 0,
        pendingFollowUps: 0,
        totalCalls: 0,
      },
      followUpStats: {
        overdueCount: 0,
        todayCount: 0,
        interestedLeadsCount: 0,
      },
      recentActivity: {
        newEnquiries: { count: 0, description: '' },
        callsMade: { count: 0, description: '' },
        enrollments: { count: 0, description: '' },
      },
      performanceMetrics: {
        totalEnquiries: 0,
        interestRate: 0,
        conversionRate: 0,
        totalCalls: 0,
      },
    };
  }
}
