import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Microlytics - Privacy-First Website Analytics",
  description: "Beautiful, simple, privacy-first analytics for your websites. No cookies, no tracking bloat. GDPR compliant.",
  keywords: ["analytics", "web analytics", "privacy", "microlytics", "GDPR"],
  authors: [{ name: "Microlytics" }],
  openGraph: {
    title: "Microlytics - Privacy-First Website Analytics",
    description: "Beautiful, simple, privacy-first analytics for your websites",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

