import {CardKey} from './cards.ts'

export default function getCardKey(suit: string, value: string): CardKey {
  return `${suit}_${value}` as CardKey
}
