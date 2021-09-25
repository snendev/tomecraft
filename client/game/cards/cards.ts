import type {CardKey} from '../types.ts'

const cardPaths: Record<CardKey, string> = {
  0: 'joker.png',
  1: 'sp_14.png',
  2: 'sp_2.png',
  3: 'sp_3.png',
  4: 'sp_4.png',
  5: 'sp_5.png',
  6: 'sp_6.png',
  7: 'sp_7.png',
  8: 'sp_8.png',
}

export function getCardSrc(cardKey: CardKey): string {
  return `/assets/${cardPaths[cardKey]}`
}

export function getCardAlt(cardKey: CardKey): string {
  return cardPaths[cardKey]
}
