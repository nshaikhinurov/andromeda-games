export const TILE_TYPES = [
  "white",
  "red",
  "dark",
  "sakura",
  "energy",
  "chaos",
] as const;

export type Tile = {
  id: string;
  type: (typeof TILE_TYPES)[number];
  isRemoved: boolean;
  hasGem: boolean;
};

export type GameGrid = Tile[][];

export type Direction = "up" | "down" | "left" | "right";
