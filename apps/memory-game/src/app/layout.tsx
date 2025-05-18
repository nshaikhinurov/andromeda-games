import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const VerlagFont = localFont({ src: "../../public/fonts/Verlag-Black.ttf" });

export const metadata: Metadata = {
  title: "Memory Game",
  description: "A simple memory card game",
  icons:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>♦️</text></svg>",
};

const grainyFilterContainer = (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id="grainy" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.537" />
      <feColorMatrix type="saturate" values="0" />
      <feBlend in="SourceGraphic" mode="multiply" />
    </filter>
  </svg>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${VerlagFont.className} antialiased w-screen h-screen`}>
        {grainyFilterContainer}
        <div className="absolute inset-0 bg-green-800 w-screen h-screen [filter:url('#grainy')] shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] -z-10" />
        {children}
      </body>
    </html>
  );
}
