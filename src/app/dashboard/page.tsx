import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getReportsByUserIdLite, getUserByEmail } from '@/lib/supabase';
import DashboardClient from '@/components/DashboardClient';

interface DashboardPageProps {
  searchParams: Promise<{ analyze?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Start fetching searchParams early (non-blocking)
  const paramsPromise = searchParams;

  // Check authentication
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  // Get user data
  const user = await getUserByEmail(session.email);

  if (!user) {
    redirect('/');
  }

  // Fetch reports and params in parallel
  const [reports, params] = await Promise.all([
    getReportsByUserIdLite(user.id),
    paramsPromise,
  ]);

  const analyzeUrl = params.analyze ? decodeURIComponent(params.analyze) : undefined;

  return (
    <DashboardClient
      user={user}
      reports={reports}
      session={session}
      pendingAnalyzeUrl={analyzeUrl}
    />
  );
}
