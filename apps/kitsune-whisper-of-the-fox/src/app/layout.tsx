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
  title: "Kitsune: Whisper of the Fox",
  description: "Magical match three game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen min-w-screen bg-slate-800 text-slate-900  `}
      >
        {/* <BokehBackground /> */}
        <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-3 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
