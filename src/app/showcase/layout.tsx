import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Startup Showcase - Discover & Share Startups | BrandProbe',
  description: 'Browse startups with their BrandProbe analysis scores. Discover great products, showcase your startup, and learn from other founders building in public.',
  openGraph: {
    title: 'Startup Showcase - Discover & Share Startups | BrandProbe',
    description: 'Browse startups with BrandProbe scores. Discover products, showcase your work, and learn from other founders.',
    type: 'website',
    url: 'https://brandprobe.io/showcase',
  },
  alternates: {
    canonical: '/showcase',
  },
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
