import React, { useEffect, useState } from "react";
import cn from "clsx";
import { flipSpeed, palette, sizes } from "~/fsd/shared/consts";
import { Card } from "../model";
import { motion, MotionStyle } from "motion/react";
import dice from "public/dice.svg";

import { Label } from "./label";

interface CardComponentProps {
  card: Card;
  className?: string;
  onClick?: (card: Card) => void;
  styles?: React.CSSProperties;
  style?: MotionStyle;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  className,
  ...rest
}) => {
  return (
    <motion.div
      className={cn(
        "will-change-transform select-none w-32 aspect-[120/168] flex shrink-0 flex-col justify-between items-start perspective-[1000] text-2xl bg-white rounded-md overflow-hidden",
        className
      )}
      {...rest}
      onClick={() => {
        rest.onClick?.(rest.card);
      }}
    ></motion.div>
  );
};

export const CardComponent2: React.FC<CardComponentProps> = ({
  card,
  onClick,
  styles,
}) => {
  const [isFacedUp, setIsFacedUp] = useState(card.isFacedUp);

  useEffect(() => {
    setIsFacedUp(card.isFacedUp);
  }, [card.isFacedUp]);

  return (
    <div
      style={{
        ...cardStyles(isFacedUp, Boolean(onClick)),
        ...styles,
      }}
      className={cn({ hidden: !card.isVisible })}
    >
      <div className="wrapper" onClick={() => onClick?.(card)}>
        <div className="face-up">
          <Label card={card} />
        </div>
        <div className="face-down">
          <div className="dice" />
        </div>
      </div>
    </div>
  );
};

const cardStyles = (isFacedUp: boolean, clickable: boolean) => {
  const stickWidth = (sizes.cardWidth * 10) / 360;
  const stickHeight = (sizes.cardHeight * 62) / 504;

  return {
    width: sizes.cardWidth,
    height: sizes.cardHeight,

    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",

    fontSize: "0.5rem",
    perspective: "1000px",

    userSelect: "none",
    transition: `transform 0.25s ease`,
    ...(clickable &&
      !isFacedUp && {
        cursor: "pointer",

        "&:hover": {
          transform: `scale(1.05)`,
        },
      }),

    "&.hidden": {
      visibility: "hidden",
    },

    ".wrapper": {
      ...(isFacedUp && { transform: "rotateY(180deg)" }),
      position: "relative",
      width: "100%",
      height: "100%",
      transition: `transform ${flipSpeed}s ease`,
      transformStyle: "preserve-3d",
      borderRadius: 0.05 * sizes.cardWidth,
      boxShadow:
        "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",

      "& .face-up, & .face-down": {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        borderRadius: 0.05 * sizes.cardWidth,
      },

      "& .face-up": {
        transform: "rotateY(180deg)",
        backgroundColor: "white",
      },
      "& .face-down": {
        background: "linear-gradient(to bottom, #303030, #202020)",
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        ".dice": {
          width: "45%",
          height: "100%",
          background: `url(${dice}) center no-repeat`,

          "&:before, &:after": {
            position: "absolute",
            backgroundColor: palette.gray,
            borderRadius: stickWidth,
            width: stickWidth,
            height: stickHeight,
            top: (sizes.cardHeight * 82) / 504,
            left: `calc(50% - ${stickWidth}px / 2)`,
            content: "''",
          },
          "&:after": {
            top: "auto",
            bottom: (sizes.cardHeight * 82) / 504,
          },
        },
      },

      "&:after": {
        position: "absolute",
        bottom: "0",
        left: "0",
        height: "inherit",
        width: "inherit",
        borderRadius: "inherit",
        content: "''",
        background:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))",
      },
    },
  } as const;
};
