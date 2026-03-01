import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandProbe - Know why you're not growing in 60 seconds",
  description: "AI-powered marketing intelligence that analyzes your website and tells you exactly what to fix this week.",
  openGraph: {
    title: "BrandProbe - Know why you're not growing in 60 seconds",
    description: "AI-powered marketing intelligence that analyzes your website and tells you exactly what to fix this week.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandProbe - Know why you're not growing in 60 seconds",
    description: "AI-powered marketing intelligence that analyzes your website and tells you exactly what to fix this week.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
