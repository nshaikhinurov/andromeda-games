import { Card as CardType } from "@/app/memory/lib/game-logic";
import { Club, Diamond, Heart, Spade } from "lucide-react";

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({
  card,
  onClick,
  disabled = false,
  className,
  style,
}: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`${className} relative h-36 w-28 transition-all duration-300 select-none ${card.isMatched ? "scale-90 opacity-0" : "scale-100 opacity-100"} ${disabled ? "" : "hover:scale-105"} `}
      onClick={handleClick}
      style={style}
    >
      {/* Контейнер для 3D эффекта переворота */}
      <div
        className={`transform-style-preserve-3d relative h-full w-full transition-transform duration-700 ${card.isFlipped ? "rotate-y-180" : ""} `}
      >
        {/* Рубашка карты (задняя сторона) */}
        <div
          className={`absolute inset-0 flex h-full w-full items-center justify-center rounded-lg border border-gray-300 bg-gradient-to-br from-blue-600 to-blue-800 shadow-md inset-ring-7 inset-ring-white backface-hidden`}
        >
          <div className="text-white opacity-30">
            <Spade strokeWidth={3} />
            <Heart strokeWidth={3} />
            <Club strokeWidth={3} />
            <Diamond strokeWidth={3} />
          </div>
        </div>

        {/* Лицевая сторона карты */}
        <div
          className={`absolute inset-0 flex h-full w-full rotate-y-180 items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-2 shadow-md backface-hidden ${getSuitColor(card.suit)} `}
        >
          <div className={`leading-none font-medium ${getRankSize(card.rank)}`}>
            {card.rank}
          </div>
          <div className="text-4xl leading-none">
            {getSuitComponent(card.suit)}
          </div>
        </div>
      </div>

      {/* Эффект свечения при совпадении */}
      {card.isMatched && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-green-400 opacity-30" />
      )}
    </div>
  );
}

const getSuitColor = (suit: string): string => {
  return suit === "♥" || suit === "♦" ? "text-rose-600" : "text-black";
};

const getRankSize = (rank: string): string => {
  return rank === "10" ? "text-3xl" : "text-4xl";
};

const getSuitComponent = (suit: string) => {
  switch (suit) {
    case "♥":
      return <Heart strokeWidth={3} size={28} className="text-rose-600" />;
    case "♦":
      return <Diamond strokeWidth={3} size={28} className="text-rose-600" />;
    case "♣":
      return <Club strokeWidth={3} size={28} className="text-black" />;
    case "♠":
      return <Spade strokeWidth={3} size={28} className="text-black" />;
  }
};
