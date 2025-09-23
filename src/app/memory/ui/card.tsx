import { Card as CardType } from "@/app/memory/lib/game-logic";
import { Club, Diamond, Heart, Spade } from "lucide-react";

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

export default function Card({ card, onClick, disabled = false }: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`
        relative w-20 h-28 sm:w-24 sm:h-32 lg:w-28 lg:h-36 
        cursor-pointer select-none transition-all duration-300
        ${card.isMatched ? "opacity-0 scale-90" : "opacity-100 scale-100"}
        ${disabled ? "cursor-not-allowed" : "hover:scale-105"}
      `}
      onClick={handleClick}
    >
      {/* Контейнер для 3D эффекта переворота */}
      <div
        className={`
          relative w-full h-full transition-transform duration-700 transform-style-preserve-3d
          ${card.isFlipped ? "rotate-y-180" : ""}
        `}
      >
        {/* Рубашка карты (задняя сторона) */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-lg border-2 border-gray-300 
            shadow-lg backface-hidden bg-gradient-to-br from-blue-600 to-blue-800
            flex items-center justify-center
          `}
        >
          <div className="text-white  opacity-30 ">
            <Spade strokeWidth={3} />
            <Heart strokeWidth={3} />
            <Club strokeWidth={3} />
            <Diamond strokeWidth={3} />
          </div>
          {/* Узор на рубашке */}
          <div className="absolute inset-2 border border-blue-300 rounded-md opacity-30" />
        </div>

        {/* Лицевая сторона карты */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-lg border-2 border-gray-300 
            shadow-lg backface-hidden rotate-y-180 bg-white
            flex items-center justify-center p-2 ${getSuitColor(card.suit)}
          `}
        >
          <div className={`font-medium leading-none ${getRankSize(card.rank)}`}>
            {card.rank}
          </div>
          <div className="text-4xl leading-none">
            {getSuitComponent(card.suit)}
          </div>
        </div>
      </div>

      {/* Эффект свечения при совпадении */}
      {card.isMatched && (
        <div className="absolute inset-0 rounded-lg bg-green-400 opacity-30 animate-pulse" />
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
      return <Diamond strokeWidth={3} size={28} className="text-rose-600 " />;
    case "♣":
      return <Club strokeWidth={3} size={28} className="text-black " />;
    case "♠":
      return <Spade strokeWidth={3} size={28} className="text-black " />;
  }
};
