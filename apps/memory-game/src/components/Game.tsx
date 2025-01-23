/** @jsxImportSource @emotion/react */

import React, { useCallback, useEffect, useRef } from 'react';
import { sizes } from 'src/consts/sizes';
import { Card } from 'src/models/Card';

import { Button } from './Button';
import CardComponent from './CardComponent';

interface GameScreenProps {
  cards: Card[];
  rerender: () => void;
  onRestart: () => void;
  onGameOver: (score: number) => void;
}

type GameState = {
  score: number;
  isPlaying: boolean;
};

const Game: React.FC<GameScreenProps> = ({ cards, onRestart, onGameOver, rerender: cloneState }) => {
  const card1 = useRef<Card | null>(null);
  const card2 = useRef<Card | null>(null);
  const openedPairs = useRef(0);

  const [state, updateState] = React.useReducer(
    (state: GameState, newState: Partial<GameState>): GameState => ({ ...state, ...newState }),
    {
      score: 0,
      isPlaying: false,
    }
  );

  const showAllCards = useCallback(() => {
    cards.forEach((card) => card.flip());
    cloneState();
    setTimeout(() => {
      cards.forEach((card) => card.flip());
      cloneState();
    }, 5600);
  }, [cards, cloneState]);

  useEffect(
    function startGame() {
      showAllCards();
      openedPairs.current = 0;
      card1.current = null;
      card2.current = null;
      setTimeout(() => updateState({ score: 0, isPlaying: true }), 5600);
    },
    [showAllCards]
  );

  function handleCardClick(card: Card) {
    if (!state.isPlaying) return;
    if (card.isFacedUp) return;

    card.flip();
    cloneState();
    // seems simpler to use timeouts instead of using transitionEnd events
    setTimeout(() => handleCardFlip(card), 600);
  }

  function handleCardFlip(card: Card) {
    if (!card1.current) {
      card1.current = card;
    } else {
      card2.current = card;

      if (Card.isPair(card1.current, card2.current)) {
        openedPairs.current++;
        if (openedPairs.current === 9) {
          return onGameOver(state.score);
        }
        card1.current.hide();
        card2.current.hide();
        updateState({ score: state.score + 42 * (9 - openedPairs.current) });
      } else {
        updateState({ score: state.score - 42 * openedPairs.current });

        card1.current.flip();
        card2.current.flip();
      }

      card1.current = null;
      card2.current = null;
    }
  }

  return (
    <div css={gameScreenStyles}>
      <div className="score-bar" style={{ visibility: state.isPlaying ? 'visible' : 'hidden' }}>
        <Button onClick={onRestart}>Restart game</Button>
        <div className="score">
          Score: <span>{state.score}</span>
        </div>
      </div>
      <div className="card-grid">
        {cards.map((card, i) => (
          <CardComponent key={i} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
};

const gameScreenStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: sizes.gap,

  '.score-bar': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    '.score': {
      textTransform: 'uppercase',
      fontSize: '0.75em',
    },
  },
  '.card-grid': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gridGap: sizes.gap,
  },
} as const;

export default Game;
