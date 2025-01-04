export const TILE_TYPES = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
] as const;

export type Tile = {
  id: string;
  type: (typeof TILE_TYPES)[number];
};

export type GameGrid = Tile[][];

export type Direction = "up" | "down" | "left" | "right";
