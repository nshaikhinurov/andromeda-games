"use client";

import { motion, PanInfo, TargetAndTransition } from "motion/react";
import Image from "next/image";
import chaos from "public/kitsune/chaos.svg";
import dark from "public/kitsune/dark.svg";
import energy from "public/kitsune/energy.svg";
import red from "public/kitsune/red.svg";
import sakura from "public/kitsune/sakura.svg";
import white from "public/kitsune/white.svg";
import React, { useRef } from "react";
import { Direction, Tile } from "../model/types";
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
  className?: string;
  availableDirections?: Direction[];
  onSwipe?: (direction: Direction) => void;
};

export const TileComponent = ({
  tile,
  onSwipe,
  availableDirections = [],
  className,
}: TileComponentProps) => {
  const tileView = tileTypeToView[tile.type];
  const isPanHandlerEnabled = useRef(true);

  const onPan = (event: unknown, info: PanInfo) => {
    if (!isPanHandlerEnabled.current) {
      return;
    }

    const x = info.offset.x;
    const y = info.offset.y;

    let direction: Direction | null = null;
    if (Math.abs(x) > Math.abs(y)) {
      direction = x > 0 ? "right" : "left";
    } else {
      direction = y > 0 ? "down" : "up";
    }

    isPanHandlerEnabled.current = false;

    if (availableDirections.includes(direction)) {
      onSwipe?.(direction);
    }
  };

  const onPanEnd = () => {
    isPanHandlerEnabled.current = true;
  };

  return (
    <motion.div
      className={cn(
        `select-none w-16 h-16 overflow-hidden flex items-center justify-center cursor-pointer relative`,
        className
      )}
      layout
      transition={{
        type: "spring",
        duration: ANIMATION_DURATIONS.layout,
      }}
      initial="initial"
      animate={tile.isRemoved ? "exit" : "idle"}
      variants={tileVariants}
      onPan={onPan}
      onPanEnd={onPanEnd}
    >
      {tileView.content}
      {tile.hasGem && (
        <div className="w-2 h-2 bg-white border-indigo-700 border-2 rounded-full z-10" />
      )}
    </motion.div>
  );
};
