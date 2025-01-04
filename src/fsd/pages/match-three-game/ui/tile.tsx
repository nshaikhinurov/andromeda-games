"use client";

import { avocado, fruit, hexagons3, strawberry } from "@lucide/lab";
import {
  Apple,
  Banana,
  Carrot,
  GlassWater,
  Grape,
  Icon,
  Lollipop,
} from "lucide-react";
import { motion, Variants } from "motion/react";
import React from "react";
import { Tile } from "../model/types";

type TileView = {
  type: Tile["type"];
  "bg-color": string;
  content: React.ReactNode;
};

const tileTypeToView: Record<Tile["type"], TileView> = {
  red: {
    type: "red",
    "bg-color": "bg-red-500",
    content: <Apple color="white" />,
  },
  orange: {
    type: "orange",
    "bg-color": "bg-orange-500",
    content: <Carrot color="white" />,
  },
  amber: {
    type: "amber",
    "bg-color": "bg-amber-500",
    content: <Icon iconNode={hexagons3} color="white" />,
  },
  yellow: {
    type: "yellow",
    "bg-color": "bg-yellow-500",
    content: <Banana color="white" />,
  },
  lime: {
    type: "lime",
    "bg-color": "bg-lime-500",
    content: <Icon iconNode={avocado} color="white" />,
  },
  cyan: {
    type: "cyan",
    "bg-color": "bg-cyan-500",
    content: <GlassWater color="white" />,
  },
  blue: {
    type: "blue",
    "bg-color": "bg-blue-500",
    content: <Icon iconNode={strawberry} color="white" />,
  },
  indigo: {
    type: "indigo",
    "bg-color": "bg-indigo-500",
    content: <Icon iconNode={fruit} color="white" />,
  },
  purple: {
    type: "purple",
    "bg-color": "bg-purple-500",
    content: <Grape color="white" />,
  },
  pink: {
    type: "pink",
    "bg-color": "bg-pink-500",
    content: <Lollipop color="white" />,
  },
};

type TileComponentProps = {
  tile: Tile;
  isSelected: boolean;
  onSelect: () => void;
};

const tileVariants: Variants = {
  idle: {
    scale: 1,
  },
  selected: {
    scale: 0.9,
  },
};

export const TileComponent = ({
  tile,
  isSelected,
  onSelect,
}: TileComponentProps) => {
  isSelected && console.log("🚀 ~ isSelected:", isSelected);
  const tileView = tileTypeToView[tile.type];

  // const onPan = (event: unknown, info: PanInfo) => {
  //   const x = info.offset.x;
  //   const y = info.offset.y;

  //   let direction: Direction | null = null;
  //   if (Math.abs(x) > Math.abs(y)) {
  //     direction = x > 0 ? "right" : "left";
  //   } else {
  //     direction = y > 0 ? "down" : "up";
  //   }

  //   const movement = Math.max(Math.abs(x), Math.abs(y));
  //   const threshold = 5;

  //   if (movement > threshold) {
  //     if (availableDirections.includes(direction)) {
  //       onSwipe(direction);
  //     }
  //   }
  // };

  return (
    <motion.div
      layout
      onClick={onSelect}
      className={`w-16 h-16 rounded-md flex justify-center items-center ${tileView["bg-color"]} cursor-pointer `}
      animate={
        isSelected
          ? {
              scale: 0.95,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }
          : {
              scale: 1,
              transition: {
                type: "spring",
                duration: 0.2,
              },
            }
      }
      transition={{
        type: "spring",
        duration: 0.3,
      }}
    >
      {tileView.content}
    </motion.div>
  );
};
