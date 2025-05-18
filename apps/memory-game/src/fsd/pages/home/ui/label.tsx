import cn from "clsx";
import React from "react";
import { Card } from "../model";
import { palette, sizes } from "~/fsd/shared/consts";

import club from "public/suits/club.svg";
import diamond from "public/suits/diamond.svg";
import heart from "public/suits/heart.svg";
import spade from "public/suits/spade.svg";

interface LabelProps {
  card: Card;
}

export const Label: React.FC<LabelProps> = ({ card }) => {
  // FYI: digits are displayed smaller in Verlag font by default, so we'll fix it
  const isNumeric = !Number.isNaN(Number(card.rank));

  return (
    <div style={labelStyles}>
      <div className={cn("suit", card.suit)} />
      <div className={cn("rank", card.color, { isNumeric })}>{card.rank}</div>
      <div className={cn("suit", "inverted", card.suit)} />
    </div>
  );
};

const fz = `${0.15 * sizes.cardWidth}px`;
const labelStyles = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexFlow: "column",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: fz,
  padding: "0.75em",

  ".suit": {
    alignSelf: "flex-start",
    "&.inverted": {
      alignSelf: "flex-end",
    },

    width: "1em",
    height: "1em",

    "&.heart": {
      background: `url(${heart}) top center no-repeat`,
    },
    "&.club": {
      background: `url(${club}) top center no-repeat`,
    },
    "&.diamond": {
      background: `url(${diamond}) top center no-repeat`,
    },
    "&.spade": {
      background: `url(${spade}) top center no-repeat`,
    },
  },

  ".rank": {
    fontSize: `calc(1.5 * ${fz})`,
    "&.isNumeric": { fontSize: `calc(1.21 * 1.5 * ${fz})` },
    lineHeight: "0.72em",
    marginBottom: 0.066 * sizes.cardWidth,
    "&.red": { color: palette.red },
    "&.black": { color: palette.black },
  },
};
