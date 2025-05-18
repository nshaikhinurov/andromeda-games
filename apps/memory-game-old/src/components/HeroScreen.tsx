/** @jsxImportSource @emotion/react */

import React from 'react';
import { sizes } from 'src/consts/sizes';
import { Card } from 'src/models/Card';
import { shuffle } from 'src/utils/shuffle';

import { Button } from './Button';
import CardComponent from './CardComponent';

const cardsNumber = 4;
const angles = Array(cardsNumber)
  .fill('')
  .map((a, i) => i * (sizes.arc / (cardsNumber - 1)) - 90 + (180 - sizes.arc) / 2);

interface HeroScreenProps {
  type: 'start' | 'end';
  headerContent: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

const HeroScreen: React.FC<HeroScreenProps> = ({ type, headerContent, onButtonClick, buttonText }) => {
  const randomCards: Card[] = shuffle(Card.getDeck()).slice(0, cardsNumber);
  randomCards.forEach((card, i) => {
    if (type === 'end' || i === 2) {
      card.flip();
    }
  });

  return (
    <div css={heroScreenStyles}>
      <div className="hero">
        {randomCards.map((card, i) => (
          <CardComponent
            key={i}
            card={card}
            styles={{
              position: 'absolute',
              transformOrigin: 'bottom center',
              transform: `rotate(${angles[i]}deg) translate(0, -${1.6 * sizes.cardHeight}px)`,
              zIndex: i === 2 ? 1 : 0,
            }}
          />
        ))}
      </div>
      <header>
        <h1 className="header">{headerContent}</h1>
      </header>
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  );
};

const heroScreenStyles = {
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  padding: '15vh',

  '.hero': {
    position: 'relative',
    top: 1.6 * sizes.cardHeight,
    height: sizes.cardHeight,
    width: sizes.cardWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
  },

  header: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: '0.5rem',
    margin: '0',
    letterSpacing: '2px',
    textAlign: 'center',
  },
} as const;

export default HeroScreen;
