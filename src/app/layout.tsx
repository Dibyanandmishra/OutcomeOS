import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OutcomeOS | Accelerate Your AI Journey",
    template: "%s | OutcomeOS",
  },
  description: "OutcomeOS is a premium AI-powered platform designed to accelerate your productivity through guided modules, real-time tracking, and interactive AI assistance.",
  keywords: ["AI", "Learning", "Productivity", "SaaS", "OutcomeOS"],
  authors: [{ name: "OutcomeOS Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
