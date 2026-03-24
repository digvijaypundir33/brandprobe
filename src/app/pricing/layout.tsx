import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Website Analysis Plans | BrandProbe',
  description: 'Choose the right BrandProbe plan for your needs. Free website analysis, Starter pack for $9, or Pro subscription at $29/month for unlimited insights and monthly re-scans.',
  openGraph: {
    title: 'Pricing - Website Analysis Plans | BrandProbe',
    description: 'Get actionable website marketing insights. Free plan available, Starter $9, Pro $29/month with monthly re-scans and progress tracking.',
    type: 'website',
    url: 'https://brandprobe.io/pricing',
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
