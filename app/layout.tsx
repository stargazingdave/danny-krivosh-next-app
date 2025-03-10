import type { Metadata } from "next";
import { Aguafina_Script, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const aguafina = Aguafina_Script({
  subsets: ["latin"],
  weight: "400", // Only one weight available for this font
  variable: "--font-aguafina", // Create a CSS variable
});

export const metadata: Metadata = {
  title: "Danny Krivosh - Original Music",
  description: "2025 (C) Danny Krivosh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();
  return (
    <html lang="en">
      <body
        className={`relative ${geistSans.variable} ${geistMono.variable} ${aguafina.variable} antialiased`}
      >
        <div className="z-50">
          <Navbar />
        </div>

        <div className="flex flex-col overflow-auto z-0" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          {children}
          <footer className="flex flex-col flex-wrap items-center justify-center text-sm">
            <p>{`© dannykrivosh.com ${year}. All Rights Reserved.`}</p>
            <p>All music and content on this site are either original compositions, properly licensed to Danny Krivosh, or used with permission.</p>
            <p>Unauthorized reproduction, distribution, or use of any material is strictly prohibited.</p>
            <p>Web app designed by David Portal.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
