import { Card as CardType } from "@/app/memory/lib/game-logic";

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

/**
 * Компонент отдельной карты с анимацией переворота
 */
export default function Card({ card, onClick, disabled = false }: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  /**
   * Получает цвет масти карты
   */
  const getSuitColor = (suit: string): string => {
    return suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";
  };

  /**
   * Получает размер символа ранга
   */
  const getRankSize = (rank: string): string => {
    return rank === "10" ? "text-3xl" : "text-4xl";
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
          <div className="text-white text-2xl font-bold opacity-30">♠♥♣♦</div>
          {/* Узор на рубашке */}
          <div className="absolute inset-2 border border-blue-300 rounded-md opacity-30" />
          <div className="absolute inset-4 border border-blue-200 rounded-sm opacity-20" />
        </div>

        {/* Лицевая сторона карты */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-lg border-2 border-gray-300 
            shadow-lg backface-hidden rotate-y-180 bg-white
            flex flex-col items-center justify-between p-2
          `}
        >
          {/* Верхний левый угол */}
          <div
            className={`flex flex-col items-center ${getSuitColor(card.suit)}`}
          >
            <div className={`font-bold leading-none ${getRankSize(card.rank)}`}>
              {card.rank}
            </div>
            <div className="text-2xl leading-none">{card.suit}</div>
          </div>

          {/* Центральный символ масти */}
          <div className={`text-6xl ${getSuitColor(card.suit)} opacity-80`}>
            {card.suit}
          </div>

          {/* Нижний правый угол (перевернутый) */}
          <div
            className={`flex flex-col items-center transform rotate-180 ${getSuitColor(
              card.suit
            )}`}
          >
            <div className={`font-bold leading-none ${getRankSize(card.rank)}`}>
              {card.rank}
            </div>
            <div className="text-2xl leading-none">{card.suit}</div>
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
