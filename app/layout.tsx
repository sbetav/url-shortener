import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Toast } from "@/components/ui/toast";
import { Providers } from "@/components/providers/providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} flex items-center justify-center bg-[radial-gradient(ellipse_75%_75%_at_50%_-20%,rgba(80,95,45,0.4),rgba(255,255,255,0))] bg-no-repeat antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <NextTopLoader color="#bbf451" />
          <div className="mx-4 min-h-screen w-full max-w-4xl sm:mx-5">
            <Header />
            <main className="pt-6">{children}</main>
            <Footer />
          </div>
          <Toast position="top-center" duration={2000} />
        </Providers>
      </body>
    </html>
  );
}
