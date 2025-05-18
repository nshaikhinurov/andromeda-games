export const sizes = {
  gap: 20,
  cardWidth: 120,
  get cardHeight() {
    return 1.4 * this.cardWidth;
  },
  arc: 50,
} as const;
