import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { backendFetch } from '@/lib/api-client';
import CompletedJobOrdersClient from './client';

export default async function CompletedJobOrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const userRole = session.user.role || 'staff';
  const userId = session.user.id;

  let branches: { id: string; name: string }[] = [];
  let availableManagers: { id: string; name: string; email: string }[] = [];

  try {
    const options = await backendFetch<{
      branches: { id: string; name: string }[];
      availableManagers: { id: string; name: string; email: string }[];
    }>('/api/v1/ui/job-order-options');
    branches = options.branches || [];
    availableManagers = options.availableManagers || [];
  } catch (err) {
    console.error('Failed to fetch job order options:', err);
  }

  return (
    <CompletedJobOrdersClient 
       userRole={userRole} 
       userId={userId} 
       branches={branches}
       availableManagers={availableManagers}
    />
  );
}
