import React from "react";
import { TileComponent } from "~/fsd/entities/tile";
import cn from "clsx";
import { Gem } from "~/fsd/shared/ui/gem";

type ScoreProps = {
  value: number;
  variant: "masks" | "gems";
};

export const Score = ({ value, variant }: ScoreProps) => {
  return (
    <div
      className={cn("flex justify-center items-center gap-2", {
        "flex-row": variant === "masks",
        "flex-row-reverse": variant === "gems",
      })}
    >
      {variant === "masks" ? (
        <TileComponent
          tile={{
            id: "score",
            type: "white",
            isRemoved: false,
            hasGem: false,
          }}
          className="w-10 h-10"
        />
      ) : (
        <Gem width={40} />
      )}
      <span className="text-4xl">{value}</span>
    </div>
  );
};
