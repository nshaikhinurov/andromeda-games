export const flipSpeed = 0.6;

export const palette = {
  gray: "#545454",
  red: "#ba0c2f",
  black: "rgb(13, 13, 13)",
} as const;

export const sizes = {
  gap: 20,
  cardWidth: 120,
  get cardHeight() {
    return 1.4 * this.cardWidth;
  },
  arc: 50,
} as const;
