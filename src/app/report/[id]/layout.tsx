import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    // Fetch report data
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('url, overall_score, is_public')
      .eq('id', id)
      .single();

    if (!report || !report.is_public) {
      return {
        title: 'Report - BrandProbe',
        description: 'Marketing analysis report',
      };
    }

    const websiteName = new URL(report.url).hostname.replace(/^www\./, '');
    const title = `${websiteName} scored ${report.overall_score}/100 - BrandProbe Marketing Analysis`;
    const description = `Detailed marketing analysis for ${websiteName}. Overall score: ${report.overall_score}/100. Get insights on SEO, messaging, content, and more.`;

    // Use environment variable for base URL, or default to production
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandprobe.io';

    return {
      title,
      description,
      metadataBase: new URL(baseUrl),
      openGraph: {
        title,
        description,
        url: `${baseUrl}/report/${id}`,
        siteName: 'BrandProbe',
        type: 'website',
        images: [
          {
            url: `${baseUrl}/report/${id}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${websiteName} Marketing Analysis`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/report/${id}/opengraph-image`],
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Report - BrandProbe',
      description: 'Marketing analysis report',
    };
  }
}

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
