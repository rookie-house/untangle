import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingHeader from "./_components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untangle",
  description: "A Platform to Demystify legal Documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect and Google Fonts for Figtree and Rubik */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div />}>
          <Providers>
             <div className="fixed top-4  z-50 flex items-center space-x-4 h-20">
                    <Link href="/" className="flex items-center h-full">
                      <Image
                    src="/logo.svg"
                    alt="Untangle Logo"
                    width={140}
                    height={70}
                    className="h-72 w-auto"
                      />
                    </Link>
                    <div className="h-full flex items-center">
                      <FloatingHeader />
                    </div>
                  </div>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
