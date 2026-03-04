import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getReportsByUserId, getUserByEmail } from '@/lib/supabase';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
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

  return (
    <DashboardClient
      user={user}
      reports={reports}
      session={session}
    />
  );
}
