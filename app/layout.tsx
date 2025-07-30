import type { Metadata } from "next";
import { Aguafina_Script, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { AppProvider } from "./AppContext";
import { getPlaylists } from "@/server/functions/getPlaylists";
import { AudioPlayer } from "./components/AudioPlayer";
import { getAllSongs } from "../server/functions/getAllSongs";

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
          className={`relative h-screen overflow-hidden ${geistSans.variable} ${geistMono.variable} ${aguafina.variable} antialiased z-0`}
        >
          <div
            style={{
              position: "relative",
              height: "calc(100vh - 3.5rem)",
              overflowY: "auto",
            }}
          >
            {/* Sticky navbar inside scroll area */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                height: "3.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.3) 70%, transparent 100%)"
                // backdropFilter: "blur(10px)",
              }}
            >
              <Navbar />
            </div>

            {/* Main content scrolls under navbar */}
            <div className="flex flex-col h-fit z-0">
              <div style={{ minHeight: "calc(100vh - 13rem)", }}>
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

          {/* Fixed Audio Player */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "3.5rem",
              backgroundColor: "#00000080",
              backdropFilter: "blur(10px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: "70rem" }}>
              <AudioPlayer />
            </div>
          </div>
        </body>
      </AppProvider>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Aguafina_Script, Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Navbar } from "./components/Navbar";
// import { AppProvider } from "./AppContext";
// import { getAllSongs } from "@/server/functions/getAllSongs";
// import { getPlaylists } from "@/server/functions/getPlaylists";
// import { AudioPlayer } from "./components/AudioPlayer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const aguafina = Aguafina_Script({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-aguafina",
// });

// export const metadata: Metadata = {
//   title: "Danny Krivosh - Original Music",
//   description: "2025 (C) Danny Krivosh",
// };

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const year = new Date().getFullYear();

//   const allSongs = await getAllSongs();
//   const initialPlaylists = await getPlaylists(allSongs);

//   return (
//     <html lang="en">
//       <AppProvider initialPlaylists={initialPlaylists}>
//         <body
//           className={`relative h-screen ${geistSans.variable} ${geistMono.variable} ${aguafina.variable} antialiased z-0 custom-scrollbar`}
//           style={{ overflow: "hidden" }}
//         >
//           {/* Dabbie gradient vibe - full opacity start with transparency at bottom */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "4rem",
//               background: "linear-gradient(to bottom, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 0.5) 60%, rgba(0, 0, 0, 0) 100%)",
//               backdropFilter: "blur(4px)",
//               pointerEvents: "none",
//               zIndex: 40,
//             }}
//           />

//           {/* Navbar */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "3.5rem",
//               zIndex: 50,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: "transparent",
//             }}
//           >
//             <Navbar />
//           </div>

//           {/* Main scroll area */}
//           <div
//             id="scroll-container"
//             style={{
//               position: "absolute",
//               top: "3.5rem",
//               bottom: "3.5rem",
//               left: 0,
//               right: 0,
//               overflowY: "scroll",
//               WebkitOverflowScrolling: "touch",
//               paddingRight: "0.75rem",
//               zIndex: 0,
//             }}
//           >
//             <div className="relative flex flex-col h-fit">
//               {children}
//               <footer className="h-fit flex flex-col flex-wrap items-center justify-center text-sm text-center p-2">
//                 <p>{`© dannykrivosh.com ${year}. All Rights Reserved.`}</p>
//                 <p>All music and content on this site are either original compositions, properly licensed to Danny Krivosh, or used with permission.</p>
//                 <p>Unauthorized reproduction, distribution, or use of any material is strictly prohibited.</p>
//                 <p>Web app created by David Portal.</p>
//               </footer>
//             </div>
//           </div>

//           {/* Audio Player */}
//           <div
//             style={{
//               position: "fixed",
//               bottom: "0",
//               left: "0",
//               width: "100%",
//               height: "3.5rem",
//               backgroundColor: "#00000080",
//               backdropFilter: "blur(10px)",
//               zIndex: 50,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <div style={{ width: "100%", maxWidth: "70rem" }}>
//               <AudioPlayer />
//             </div>
//           </div>

//           {/* Scroll behavior script */}
//           <script
//             dangerouslySetInnerHTML={{
//               __html: `
//                 (() => {
//                   const scrollable = document.getElementById('scroll-container');
//                   let timeout;
//                   scrollable.addEventListener('scroll', () => {
//                     scrollable.classList.add('scrolling');
//                     clearTimeout(timeout);
//                     timeout = setTimeout(() => {
//                       scrollable.classList.remove('scrolling');
//                     }, 1000);
//                   });
//                 })();
//               `,
//             }}
//           />
//         </body>
//       </AppProvider>
//     </html>
//   );
// }
