const SCORE_MULTIPLIER = 42;

/**
 * Типы карт и игровых состояний для игры Memory
 */

export interface Card {
  id: string;
  suit: string; // ♠, ♥, ♣, ♦
  rank: string; // A, 2, 3, ..., K
  isFlipped: boolean;
  isMatched: boolean;
  value: string; // уникальный идентификатор для проверки совпадений
}

export interface GameState {
  cards: Card[];
  score: number;
  flippedCards: Card[];
  isGameOver: boolean;
  moves: number;
}

/**
 * Создает колоду карт для игры Memory
 * @param gridSize - размер сетки (например, 4 для сетки 4x4)
 * @returns массив карт
 */
export function createDeck(gridCols: number = 4, gridRows: number = 4): Card[] {
  const suits = ["♠", "♥", "♣", "♦"];
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const totalCards = gridCols * gridRows;
  const pairsNeeded = totalCards / 2;

  if (totalCards % 2 !== 0) {
    throw new Error("Общее количество карт должно быть четным");
  }

  // Создаем полный набор всех возможных карт
  const allPossibleCards: { suit: string; rank: string; value: string }[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      allPossibleCards.push({
        suit,
        rank,
        value: `${suit}${rank}`,
      });
    }
  }

  // Перемешиваем и выбираем случайную половину
  const shuffledCards = shuffleArray(allPossibleCards);
  const selectedCards = shuffledCards.slice(0, pairsNeeded);

  // Создаем пары из выбранных карт
  const cards: Card[] = [];
  for (const cardTemplate of selectedCards) {
    // Создаем пару одинаковых карт
    for (let i = 0; i < 2; i++) {
      cards.push({
        id: `${cardTemplate.value}-${i}`,
        suit: cardTemplate.suit,
        rank: cardTemplate.rank,
        isFlipped: false,
        isMatched: false,
        value: cardTemplate.value,
      });
    }
  }

  // Перемешиваем финальный набор карт
  return shuffleArray(cards);
}

/**
 * Перемешивает массив методом Фишера-Йетса
 * @param array - массив для перемешивания
 * @returns перемешанный массив
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Проверяет, совпадают ли две карты
 * @param card1 - первая карта
 * @param card2 - вторая карта
 * @returns true, если карты совпадают
 */
export function cardsMatch(card1: Card, card2: Card): boolean {
  return card1.value === card2.value && card1.id !== card2.id;
}

/**
 * Вычисляет очки за совпадение пары
 * @param remainingPairs - количество оставшихся нераскрытых пар
 * @returns количество очков
 */
export function calculateMatchScore(remainingPairs: number): number {
  return remainingPairs * SCORE_MULTIPLIER;
}

/**
 * Вычисляет штраф за несовпадение
 * @param revealedPairs - количество уже раскрытых пар
 * @returns количество очков для вычитания (положительное число)
 */
export function calculateMismatchPenalty(revealedPairs: number): number {
  return revealedPairs * SCORE_MULTIPLIER;
}

/**
 * Подсчитывает количество оставшихся нераскрытых пар
 * @param cards - массив всех карт
 * @returns количество нераскрытых пар
 */
export function getRemainingPairs(cards: Card[]): number {
  const unmatched = cards.filter((card) => !card.isMatched);
  return unmatched.length / 2;
}

/**
 * Подсчитывает количество уже раскрытых пар
 * @param cards - массив всех карт
 * @returns количество раскрытых пар
 */
export function getRevealedPairs(cards: Card[]): number {
  const matched = cards.filter((card) => card.isMatched);
  return matched.length / 2;
}

/**
 * Проверяет, завершена ли игра (все пары найдены)
 * @param cards - массив всех карт
 * @returns true, если все карты совпали
 */
export function isGameComplete(cards: Card[]): boolean {
  return cards.every((card) => card.isMatched);
}

/**
 * Создает начальное состояние игры
 * @param gridCols - размер сетки
 * @returns начальное состояние игры
 */
export function createInitialGameState(
  gridCols: number,
  gridRows: number,
): GameState {
  return {
    score: 0,
    moves: 0,
    isGameOver: false,
    flippedCards: [],
    cards: createDeck(gridCols, gridRows),
  };
}

/**
 * Обновляет состояние игры после переворота карты
 * @param gameState - текущее состояние игры
 * @param cardId - ID перевернутой карты
 * @returns новое состояние игры
 */
export function flipCard(gameState: GameState, cardId: string): GameState {
  const { cards, flippedCards, score, moves } = gameState;

  // Найдем карту для переворота
  const cardToFlip = cards.find((card) => card.id === cardId);

  if (
    !cardToFlip ||
    cardToFlip.isFlipped ||
    cardToFlip.isMatched ||
    flippedCards.length >= 2
  ) {
    return gameState; // Нельзя перевернуть эту карту
  }

  // Создаем новый массив карт с перевернутой картой
  const newCards = cards.map((card) =>
    card.id === cardId ? { ...card, isFlipped: true } : card,
  );

  const newFlippedCards = [...flippedCards, cardToFlip];
  let newScore = score;
  let newMoves = moves;

  // Если это вторая перевернутая карта в ходу
  if (newFlippedCards.length === 2) {
    newMoves = moves + 1;

    const [firstCard, secondCard] = newFlippedCards;

    if (cardsMatch(firstCard, secondCard)) {
      // Карты совпали - помечаем их как совпавшие
      const matchedCards = newCards.map((card) =>
        card.id === firstCard.id || card.id === secondCard.id
          ? { ...card, isMatched: true }
          : card,
      );

      const remainingPairs = getRemainingPairs(matchedCards);
      newScore += calculateMatchScore(remainingPairs);

      return {
        cards: matchedCards,
        score: newScore,
        flippedCards: [],
        isGameOver: isGameComplete(matchedCards),
        moves: newMoves,
      };
    } else {
      // Карты не совпали - вычитаем очки
      const revealedPairs = getRevealedPairs(newCards);
      newScore -= calculateMismatchPenalty(revealedPairs);

      // Возвращаем карты обратно (с задержкой в UI)
      return {
        cards: newCards,
        score: Math.max(0, newScore), // Не позволяем счету уйти в минус
        flippedCards: newFlippedCards,
        isGameOver: false,
        moves: newMoves,
      };
    }
  }

  // Первая карта в ходу
  return {
    cards: newCards,
    score: newScore,
    flippedCards: newFlippedCards,
    isGameOver: false,
    moves: newMoves,
  };
}

/**
 * Переворачивает карты обратно после неудачного совпадения
 * @param gameState - текущее состояние игры
 * @returns новое состояние игры
 */
export function resetFlippedCards(gameState: GameState): GameState {
  const { cards, flippedCards } = gameState;

  if (flippedCards.length !== 2) {
    return gameState;
  }

  const newCards = cards.map((card) => {
    if (
      flippedCards.some((flipped) => flipped.id === card.id) &&
      !card.isMatched
    ) {
      return { ...card, isFlipped: false };
    }
    return card;
  });

  return {
    ...gameState,
    cards: newCards,
    flippedCards: [],
  };
}
