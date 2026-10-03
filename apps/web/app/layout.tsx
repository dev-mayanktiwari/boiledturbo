import type { Metadata } from "next";
import localFont from "next/font/local";
import { ENV } from "@repo/env/client";
import "./globals.css";

// Runs at build time (and on the server), so a missing or invalid NEXT_PUBLIC_API_URL
// fails `next build` instead of shipping a broken bundle.
ENV.CLIENT.get("NEXT_PUBLIC_API_URL");

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Turbo Boiler",
  description: "Turborepo boilerplate with Next.js, tRPC, Express and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
