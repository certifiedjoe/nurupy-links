
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "NuruPy Links | Smarter Links. Bigger Possibilities.",
    template: "%s | NuruPy Links",
  },
  description:
    "Create smart short links, generate QR codes, track clicks, explore analytics, and build better digital experiences with NuruPy Links.",
  applicationName: "NuruPy Links",
  keywords: [
    "NuruPy Links",
    "URL shortener",
    "Link management",
    "QR code generator",
    "Deep linking",
    "Link analytics",
    "Smart links",
  ],
  openGraph: {
    title: "NuruPy Links",
    description:
      "Turn ordinary URLs into powerful digital experiences.",
    siteName: "NuruPy Links",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-[#111111]">
        {children}
      </body>
    </html>
  );
}
