import pickRandom from "~/fsd/shared/utils/pick-random";
import { Tile, TILE_TYPES } from "./types";

let id = 0;

export const generateRandomTile = (): Tile => ({
  id: String(id++),
  type: pickRandom(TILE_TYPES),
  isRemoved: false,
});
