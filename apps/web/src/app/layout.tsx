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
    <html
      className="dark"
      lang="en">
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
            <div className="fixed p-5 top-4 z-50 flex items-center bg-none space-x-4 h-10">
              {/* <Link href="/" className="flex items-center gap-3 h-full">
                <Image
                  src="/logo.png"
                  alt="Untangle Logo"
                  width={100}
                  height={100}
                  className="h-[30px] w-auto"
                />
                <span>Untangle</span>
              </Link> */}
              <div className="">
                {/* <ThemeToggle /> */}
              </div>
              <div className="h-full flex items-center">
                {/* <FloatingHeader /> */}
              </div>
            </div>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
