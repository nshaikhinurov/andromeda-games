"use client";

import { motion, PanInfo, TargetAndTransition } from "motion/react";

import cn from "clsx";
import { useRef } from "react";
import { Tile } from "~/fsd/pages/model/types";
import { Mask } from "~/fsd/pages/ui/mask";
import { Gem } from "~/fsd/shared/ui/gem";
import { Direction } from "../direction";

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
  onSwipe?: (direction: Direction) => void;
  handlePan?: (x: number, y: number) => void;
};

export const TileComponent = ({
  tile,
  handlePan,
  className,
}: TileComponentProps) => {
  const isPanning = useRef(false);

  const onPan = (event: unknown, info: PanInfo) => {
    if (isPanning.current) {
      return;
    }

    isPanning.current = true;

    handlePan?.(info.offset.x, info.offset.y);
  };

  const onPanEnd = () => {
    isPanning.current = false;
  };

  return (
    <motion.div
      className={cn(
        `select-none overflow-hidden flex items-center justify-center cursor-pointer relative`,
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
      <Mask type={tile.type} />
      {tile.hasGem && <Gem />}
    </motion.div>
  );
};
