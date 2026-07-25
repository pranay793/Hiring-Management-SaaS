import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { HiringProvider } from "@/context/hiring-context";
import ClientLayout from "@/components/layout/client-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RecruitFlow AI - AI-Powered Hiring & Recruitment Management Platform",
  description: "Manage candidate pipelines, schedule panel interviews, analyze resumes with AI matching, and monitor recruitment performance in one unified, collaborative platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <HiringProvider>
            <ClientLayout>{children}</ClientLayout>
          </HiringProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
