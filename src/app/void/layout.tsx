import { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "void",
  description:
    "An online puzzle game where you fill the void with meaning. No instructions, no images, no sound, only keyboard.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23171717'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function VoidAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${jetbrainsMono.className} dark flex h-screen w-screen flex-col items-center justify-center gap-6 overflow-hidden bg-neutral-900 p-4 text-neutral-200 select-none`}
      style={{ fontVariantLigatures: "none" }}
    >
      {children}
    </div>
  );
}
