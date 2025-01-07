"use client";

import { motion, TargetAndTransition } from "motion/react";
import Image from "next/image";
import chaos from "public/kitsune/chaos.svg";
import dark from "public/kitsune/dark.svg";
import energy from "public/kitsune/energy.svg";
import red from "public/kitsune/red.svg";
import sakura from "public/kitsune/sakura.svg";
import white from "public/kitsune/white.svg";
import React from "react";
import { Tile } from "../model/types";
import cn from "clsx";

type TileView = {
  type: Tile["type"];
  content: React.ReactNode;
};

const tileTypeToView: Record<Tile["type"], TileView> = {
  white: {
    type: "white",
    content: (
      <Image
        unoptimized
        alt="white"
        src={white}
        fill
        className="pointer-events-none"
      />
    ),
  },
  red: {
    type: "red",
    content: (
      <Image
        unoptimized
        alt="red"
        src={red}
        fill
        className="pointer-events-none"
      />
    ),
  },
  dark: {
    type: "dark",
    content: (
      <Image
        unoptimized
        alt="dark"
        src={dark}
        fill
        className="pointer-events-none"
      />
    ),
  },
  sakura: {
    type: "sakura",
    content: (
      <Image
        unoptimized
        alt="sakura"
        src={sakura}
        fill
        className="pointer-events-none"
      />
    ),
  },
  energy: {
    type: "energy",
    content: (
      <Image
        unoptimized
        alt="energy"
        src={energy}
        fill
        className="pointer-events-none"
      />
    ),
  },
  chaos: {
    type: "chaos",
    content: (
      <Image
        unoptimized
        alt="chaos"
        src={chaos}
        fill
        className="pointer-events-none"
      />
    ),
  },
};

const timeMultiplier = 1;

export const ANIMATION_DURATIONS = {
  select: 0.3 * timeMultiplier,
  layout: 0.3 * timeMultiplier,
  exit: 0.5 * timeMultiplier,
} as const;

const tileVariants: Record<string, TargetAndTransition> = {
  initial: {
    y: -64,
    scale: 0,
    opacity: 0,
  },
  idle: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      duration: ANIMATION_DURATIONS.select,
    },
  },
  selected: {
    y: 0,
    opacity: 1,
    scale: 0.9,
    transition: {
      type: "spring",
      duration: ANIMATION_DURATIONS.select,
    },
  },
  exit: {
    y: 0,
    scale: 2.5,
    opacity: 0,
    transition: {
      type: "tween",
      duration: ANIMATION_DURATIONS.exit,
    },
  },
};

type TileComponentProps = {
  tile: Tile;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const TileComponent = ({
  tile,
  isSelected = false,
  onSelect,
  className,
}: TileComponentProps) => {
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
      className={cn(
        `select-none w-16 h-16 overflow-hidden flex place-content-center cursor-pointer relative`,
        className
      )}
      layout
      transition={{
        type: "spring",
        duration: ANIMATION_DURATIONS.layout,
      }}
      initial="initial"
      animate={tile.isRemoved ? "exit" : isSelected ? "selected" : "idle"}
      variants={tileVariants}
      onClick={onSelect}
    >
      {tileView.content}
    </motion.div>
  );
};
