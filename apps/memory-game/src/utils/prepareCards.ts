import { Card } from 'src/models/Card';

import { shuffle } from './shuffle';

export function prepareCards(): Card[] {
  const nineRandomCards = shuffle(Card.getDeck()).slice(0, 9);

  return shuffle([...nineRandomCards.map((card) => card.clone()), ...nineRandomCards.map((card) => card.clone())]);
}
