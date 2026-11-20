import type { Metadata } from 'next';
import './../globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { APP_CONFIG, theme } from '@/config/app';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { backendFetch } from '@/lib/api-client';

export const metadata: Metadata = {
  description: APP_CONFIG.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession();
  if (!session) {
    redirect('/login');
  }
  const { user } = session;

  let counts = {
    enquiries: 0,
    jobOrdersPending: 0,
    followUps: 0,
  };

  if (user) {
    try {
      counts = await backendFetch('/api/v1/ui/sidebar-counts');
    } catch (err) {
      console.error('Failed to fetch sidebar counts:', err);
    }
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': theme.sidebarWidth,
          '--header-height': theme.headerHeight,
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} counts={counts} />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 bg-background min-h-[calc(100vh-var(--header-height))]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
