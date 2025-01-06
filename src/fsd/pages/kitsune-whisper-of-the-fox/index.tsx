"use client";

import { Yusei_Magic } from "next/font/google";
import { GameGridComponent } from "./ui/game-grid";

const font = Yusei_Magic({
  weight: "400",
  subsets: ["latin"],
});

export const KitsuneGamePage = () => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-y-10 ${font.className}`}
    >
      <h1 className={`text-6xl text-white`}>Kitsune: Whisper of the Fox</h1>
      <GameGridComponent />
    </div>
  );
};
