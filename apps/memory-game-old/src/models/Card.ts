enum Color {
  Red = 'red',
  Black = 'black',
}

export enum Suit {
  Clubs = 'club',
  Diamonds = 'diamond',
  Hearts = 'heart',
  Spades = 'spade',
}

export enum Rank {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export class Card {
  private visible: boolean;
  private facedUp: boolean;
  rank: Rank;
  suit: Suit;
  color: Color;

  constructor(rank: Rank, suit: Suit) {
    const color = suit === Suit.Clubs || suit === Suit.Spades ? Color.Black : Color.Red;

    this.visible = true;
    this.facedUp = false;
    this.rank = rank;
    this.suit = suit;
    this.color = color;
  }

  get isFacedUp(): boolean {
    return this.facedUp;
  }

  get isVisible(): boolean {
    return this.visible;
  }

  flip(): void {
    this.facedUp = !this.facedUp;
  }

  hide(): void {
    this.visible = false;
  }

  clone(): Card {
    const card = new Card(this.rank, this.suit);
    card.facedUp = this.facedUp;
    card.visible = this.visible;
    return card;
  }

  static getDeck(): Card[] {
    return Object.values(Rank).reduce<Card[]>((deck, rank) => {
      Object.values(Suit).forEach((suit) => {
        deck.push(new Card(rank, suit));
      });
      return deck;
    }, []);
  }

  static isPair(card1: Card, card2: Card): boolean {
    return card1.rank === card2.rank && card1.suit === card2.suit;
  }
}
