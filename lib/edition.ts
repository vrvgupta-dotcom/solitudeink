export const EDITION_CONFIG = {
  total: 2000,
  signaturePremium: 300,
  ladder: [
    { upTo: 500,  price: 300 },
    { upTo: 1000, price: 370 },
    { upTo: 1500, price: 440 },
    { upTo: 1900, price: 510 },
    { upTo: 2000, price: 580 },
  ],
} as const;

export interface EditionState {
  claimed:          number;
  total:            number;
  reserveNo:        number;
  hardcover:        number;
  signature:        number;
  final:            number;
  nextStepNo:       number | null;
  remainingInTier:  number;
  tierIndex:        number;
  pct:              number;
}

// Swap this fetch for a real DB call when backend is ready.
async function fetchClaimed(): Promise<number> {
  return 340;
}

export async function getEditionState(): Promise<EditionState> {
  const claimed = await fetchClaimed();
  const { total, signaturePremium, ladder } = EDITION_CONFIG;

  const tierIndex = ladder.findIndex((rung) => claimed < rung.upTo);
  const safeIndex = tierIndex === -1 ? ladder.length - 1 : tierIndex;
  const tier = ladder[safeIndex];

  const nextTier = safeIndex < ladder.length - 1 ? ladder[safeIndex + 1] : null;

  return {
    claimed,
    total,
    reserveNo:       claimed + 1,
    hardcover:       tier.price,
    signature:       tier.price + signaturePremium,
    final:           ladder[ladder.length - 1].price,
    nextStepNo:      nextTier ? ladder[safeIndex].upTo + 1 : null,
    remainingInTier: tier.upTo - claimed,
    tierIndex:       safeIndex,
    pct:             claimed / total,
  };
}

// Synchronous version for client-side calculations seeded from server data.
export function deriveEditionState(claimed: number): EditionState {
  const { total, signaturePremium, ladder } = EDITION_CONFIG;
  const tierIndex = ladder.findIndex((rung) => claimed < rung.upTo);
  const safeIndex = tierIndex === -1 ? ladder.length - 1 : tierIndex;
  const tier = ladder[safeIndex];
  const nextTier = safeIndex < ladder.length - 1 ? ladder[safeIndex + 1] : null;

  return {
    claimed,
    total,
    reserveNo:       claimed + 1,
    hardcover:       tier.price,
    signature:       tier.price + signaturePremium,
    final:           ladder[ladder.length - 1].price,
    nextStepNo:      nextTier ? ladder[safeIndex].upTo + 1 : null,
    remainingInTier: tier.upTo - claimed,
    tierIndex:       safeIndex,
    pct:             claimed / total,
  };
}
