"use client";
import React, { useEffect, useState } from "react";
import { sizes } from "~/fsd/shared/consts";
import { Card } from "../model";
import { shuffle } from "@andromeda-games/utils";

import { Button } from "~/fsd/shared/ui/button";
import { CardComponent } from "./card";

const ARC = 50;
const CARDS_NUMBER = 4;

interface HeroScreenProps {
  type: "start" | "end";
  headerContent: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  type,
  headerContent,
  onButtonClick,
  buttonText,
}) => {
  const [randomCards, setRandomCards] = useState<Card[]>([]);

  useEffect(() => {
    const randomCards = shuffle(Card.getDeck()).slice(0, CARDS_NUMBER);
    randomCards.forEach((card, i) => {
      if (type === "end" || i === 2) {
        card.flip();
      }
    });
    setRandomCards(randomCards);
  }, [type]);

  return (
    <div className="flex flex-col justify-between items-center p-[15vh] h-screen">
      <div className="w-full h-52 relative">
        {randomCards.map((card, i) => (
          <CardComponent
            key={i}
            card={card}
            className="absolute top-[50%] left-[50%] shadow-xl"
            style={{
              zIndex: i === 2 ? 1 : 0,
              originX: 0.5,
              originY: 2.6,
              rotate: -ARC / 2 + (ARC / (CARDS_NUMBER - 1)) * i,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        ))}
      </div>

      <header>
        <h1 className="uppercase text-white text-5xl font-bold tracking-wider text-center">
          {headerContent}
        </h1>
      </header>

      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  );
};
