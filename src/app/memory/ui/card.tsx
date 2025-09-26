import { Card as CardType } from "@/app/memory/lib/game-logic";
import { cn } from "@/lib/utils";
import { Brain, Club, Diamond, Heart, Spade } from "lucide-react";

const getSuitColor = (suit: string): string => {
  return suit === "♥" || suit === "♦" ? "text-rose-600" : "text-black";
};

const getSuitComponent = (suit: string) => {
  switch (suit) {
    case "♥":
      return <Heart strokeWidth={2.8} className="size-[1em] text-rose-600" />;
    case "♦":
      return <Diamond strokeWidth={2.8} className="size-[1em] text-rose-600" />;
    case "♣":
      return <Club strokeWidth={2.8} className="size-[1em] text-black" />;
    case "♠":
      return <Spade strokeWidth={2.8} className="size-[1em] text-black" />;
  }
};

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Card({
  card,
  onClick,
  disabled = false,
  style,
}: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={cn(
        `appear-card relative aspect-28/36 w-full transition-all duration-300 select-none perspective-distant`,
        {
          "hover:scale-105": !card.isFlipped && !disabled,
        },
      )}
      onClick={handleClick}
      style={style}
    >
      {/* Контейнер для 3D эффекта переворота */}
      <div
        className={cn(
          "@container relative h-full w-full transition-all duration-700 transform-3d",
          {
            "scale-0 opacity-0": card.isMatched,
            "rotate-y-180": card.isFlipped,
          },
        )}
      >
        {/* Рубашка карты (задняя сторона) */}
        <div
          className={`group absolute inset-0 flex h-full w-full items-center justify-center rounded-lg bg-[oklch(0.625_0.18_15)] shadow-md transition-colors backface-hidden hover:bg-[oklch(0.675_0.18_15)]`}
        >
          <Brain className="h-auto w-[40%] rotate-15 text-[oklch(0.575_0.18_15)] transition-colors group-hover:text-[oklch(0.625_0.18_15)]" />
        </div>

        {/* Лицевая сторона карты */}
        <div
          className={`absolute inset-0 flex h-full w-full rotate-y-180 items-center justify-center rounded-lg bg-white p-2 text-[25cqw] shadow-md backface-hidden ${getSuitColor(card.suit)} `}
        >
          <div className={`leading-none font-medium`}>{card.rank}</div>
          <div className="leading-none">{getSuitComponent(card.suit)}</div>
        </div>
      </div>
    </div>
  );
}
