import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/Footer";
import { Toast } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shortie | URL Shortener",
  description: "Easily shorten your URLs, no sign up required.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} flex items-center justify-center antialiased bg-[radial-gradient(ellipse_75%_75%_at_50%_-20%,rgba(80,95,45,0.4),rgba(255,255,255,0))] bg-no-repeat`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen max-w-4xl w-full mx-4 sm:mx-5">
            <Navbar user={user} />
            <main className="pt-6">{children}</main>
            <Footer />
          </div>
          <Toast position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
