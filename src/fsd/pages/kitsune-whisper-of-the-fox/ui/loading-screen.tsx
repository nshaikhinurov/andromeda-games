"use client";

import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { useClientState } from "~/fsd/shared/utils/use-client-state";
import { generateRandomTile } from "../model/tile-generator";
import { Tile } from "../model/types";
import { TileComponent } from "./tile";

export const LoadingScreen = () => {
  const [tile, setTile] = useClientState<Tile>(generateRandomTile);

  useEffect(() => {
    const timer = setInterval(() => {
      setTile(generateRandomTile);
    }, 1000);

    return () => clearInterval(timer);
  }, [setTile]);

  return (
    <div className="flex content-center gap-4">
      <h1 className="text-6xl text-white text-center">Loading...</h1>
      <AnimatePresence mode="wait">
        {tile && <TileComponent key={tile.id} tile={tile} />}
      </AnimatePresence>
    </div>
  );
};
