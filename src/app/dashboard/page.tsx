import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getReportsByUserId, getUserByEmail } from '@/lib/supabase';
import DashboardClient from '@/components/DashboardClient';

interface DashboardPageProps {
  searchParams: Promise<{ analyze?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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

  // Get all reports for this user
  const reports = await getReportsByUserId(user.id);

  // Get the analyze URL from query params
  const params = await searchParams;
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
