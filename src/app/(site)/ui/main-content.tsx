import { jetbrainsMono } from "@/app/void/layout";
import { voidGameDescription } from "@/app/void/page";
import Image from "next/image";
import { GameCard } from "./game-card";

export const MainContent = () => {
  return (
    <div className="p-6">
      <div
        className="grid"
        style={
          {
            // setting max-columns while using auto-fit
            "--grid-max-col-count": 5,
            "--grid-min-col-size": "240px",
            "--grid-gap": "24px",
            "--grid-col-size-calc":
              "calc((100% - (var(--grid-gap) * (var(--grid-max-col-count) - 1))) / var(--grid-max-col-count))",
            "--grid-col-min-size-calc":
              "min(100%, max(var(--grid-min-col-size), var(--grid-col-size-calc)))",
            gap: "var(--grid-gap)",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(var(--grid-col-min-size-calc), 1fr))",
          } as React.CSSProperties
        }
      >
        <GameCard
          href="/memory"
          title="Memory"
          description="Card game to test your memory"
          thumbnail={
            <Image
              src={"/memory-logo.svg"}
              alt="Memory Game Logo"
              width={198.08}
              height={64.45}
              unoptimized
              className="mx-auto h-auto w-[80%] object-contain transition-transform group-hover:scale-105"
            />
          }
        />
        <GameCard
          href="/void"
          title="void"
          description={voidGameDescription}
          thumbnail={
            <div
              className={`${jetbrainsMono.className} flex h-full w-full items-center justify-center bg-neutral-900 p-4 text-4xl font-bold text-gray-200`}
            >
              void
            </div>
          }
        />
        <GameCard title="Tango Game" description="Fill the grid with colors" />
        <GameCard
          title="Kitsune: Whisper of the Fox"
          description="Three in a row game"
        />
        <GameCard title="Battle Ships" description="Naval strategy game" />
      </div>
    </div>
  );
};
