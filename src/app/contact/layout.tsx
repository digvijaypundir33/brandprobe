import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | BrandProbe',
  description: 'Contact the BrandProbe team. Have questions about website analysis, pricing, or need support? We typically respond within 24 hours.',
  openGraph: {
    title: 'Contact Us - Get in Touch | BrandProbe',
    description: 'Contact the BrandProbe team for questions about website analysis, pricing, or support.',
    type: 'website',
    url: 'https://brandprobe.io/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
