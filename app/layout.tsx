import type { Metadata } from "next";
import { Aguafina_Script, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { AppProvider } from "./AppContext";
import { getAllSongs } from "@/server/functions/getAllSongs";
import { getPlaylists } from "@/server/functions/getPlaylists";
import { AudioPlayer } from "./components/AudioPlayer";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  const allSongs = await getAllSongs();
  const initialPlaylists = await getPlaylists(allSongs);

  return (
    <html lang="en">
      <AppProvider initialPlaylists={initialPlaylists}>
        <body
          className={`relative h-screen ${geistSans.variable} ${geistMono.variable} ${aguafina.variable} antialiased z-0 overflow-hidden`}
        >
          <div style={{
            height: "3.5rem",
          }}>
            <Navbar />
          </div>

          <div style={{
            position: "fixed",
            top: "3.5rem",
            height: "calc(100vh - 7rem)",
            width: "100%",
            overflowY: "auto",
          }}>
            <div className="flex flex-col z-0 justify-between min-h-fit overflow-auto">
              <div className="flex flex-col h-fit"
              >
                {children}
              </div>

              <footer className="h-fit flex flex-col flex-wrap items-center justify-center text-sm text-center p-2">
                <p>{`© dannykrivosh.com ${year}. All Rights Reserved.`}</p>
                <p>All music and content on this site are either original compositions, properly licensed to Danny Krivosh, or used with permission.</p>
                <p>Unauthorized reproduction, distribution, or use of any material is strictly prohibited.</p>
                <p>Web app created by David Portal.</p>
              </footer>
            </div>
          </div>

          <div style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "3.5rem",
            backgroundColor: "#00000080",
            backdropFilter: "blur(10px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "100%",
              maxWidth: "70rem",
            }}>
              <AudioPlayer />
            </div>
          </div>
        </body>
      </AppProvider>
    </html>
  );
}
