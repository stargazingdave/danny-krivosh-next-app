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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${aguafina.variable} antialiased`}
      >
        <Navbar />
        {children}
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <p>שבר כלי מאז 1821</p>
        </footer>
      </body>
    </html>
  );
}
