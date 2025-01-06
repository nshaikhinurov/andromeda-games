import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitsune: Whisper of the Fox",
  description: "Magical match three game",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen min-w-screen flex-1 flex flex-col items-center justify-center relative z-10 bg-slate-800">
      {children}
    </main>
  );
}
