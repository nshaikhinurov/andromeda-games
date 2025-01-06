"use client";

import { AnimatePresence } from "motion/react";
import { TileComponent } from "./tile";
import { useEffect, useState } from "react";
import { generateRandomTile } from "../model/tile-generator";
import { useClientState } from "~/fsd/shared/utils/use-client-state";
import { Tile } from "../model/types";

export const LoadingScreen = () => {
  const [tile, setTile] = useClientState<Tile>(generateRandomTile);

  useEffect(() => {
    const timer = setInterval(() => {
      setTile(generateRandomTile);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-6xl text-white text-center">Loading...</h1>
      <AnimatePresence mode="wait">
        {tile && <TileComponent key={tile.id} tile={tile} />}
      </AnimatePresence>
    </div>
  );
};
