import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BrandProbe - Website Marketing Analysis & SEO Audit Tool for Startups",
  description: "Get instant website marketing analysis and actionable startup feedback in 60 seconds. AI-powered marketing audit tool covering SEO, messaging, content strategy, and conversion optimization.",
  keywords: ["website marketing analysis", "startup website feedback", "marketing audit tool", "SEO audit", "website analyzer", "conversion optimization", "content strategy tool"],
  metadataBase: new URL('https://brandprobe.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BrandProbe - Website Marketing Analysis & SEO Audit Tool",
    description: "Get instant website marketing analysis and actionable startup feedback in 60 seconds. AI-powered marketing audit covering SEO, messaging, and conversion.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandProbe - Website Marketing Analysis Tool",
    description: "Get instant website marketing analysis and actionable startup feedback in 60 seconds. AI-powered marketing audit covering SEO, messaging, and conversion.",
  },
};

// JSON-LD Schema markup for SEO and AI Search visibility
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BrandProbe",
  url: "https://brandprobe.io",
  logo: "https://brandprobe.io/favicon.ico",
  description: "AI-powered marketing intelligence that analyzes your website and tells you exactly what to fix this week.",
  sameAs: [
    "https://x.com/brandprobe"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://brandprobe.io/support"
  }
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BrandProbe",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "AI-powered website analysis tool that provides actionable marketing intelligence and growth recommendations.",
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "1 free website analysis"
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "29",
      priceCurrency: "USD",
      description: "10 reports per month with priority support"
    }
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "50",
    bestRating: "5",
    worstRating: "1"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is BrandProbe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BrandProbe is an AI-powered marketing intelligence tool that analyzes your website in 60 seconds and tells you exactly what to fix to grow your business. It provides actionable recommendations across messaging, SEO, conversion optimization, and more."
      }
    },
    {
      "@type": "Question",
      name: "How does the website analysis work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply enter your website URL and BrandProbe's AI will scan your site, analyzing 10 key areas including messaging clarity, SEO opportunities, conversion optimization, content strategy, and technical performance. You'll receive a detailed report with prioritized recommendations."
      }
    },
    {
      "@type": "Question",
      name: "Is BrandProbe free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can analyze one website for free. For more reports and advanced features, we offer affordable paid plans starting at $29/month for 10 reports."
      }
    },
    {
      "@type": "Question",
      name: "What areas does BrandProbe analyze?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BrandProbe analyzes 10 key areas: Messaging & Positioning, SEO Opportunities, Content Strategy, Ad Angles, Conversion Optimization, Distribution Strategy, AI Search Visibility, Technical Performance, Brand Health, and Design Authenticity."
      }
    },
    {
      "@type": "Question",
      name: "How long does the analysis take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most website analyses complete in under 60 seconds. Complex sites with many pages may take slightly longer, but you'll typically have your full report within 2 minutes."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
