import type {Selection} from './types.ts'

function isAlly(selection: Selection): boolean {
  return selection.target === 'ally'
}

function isHand(selection: Selection): boolean {
  return selection.type === 'hand'
}

function isBoard(selection: Selection): boolean {
  return selection.type === 'board'
}

export function isPlayCardSelection(first: Selection, second: Selection): boolean {
  const isMyHand = isAlly(first) && isHand(first)
  const targetsMyBoard = isAlly(second) && isBoard(second)
  return isMyHand && targetsMyBoard
}

export function isAttackSelection(first: Selection, second: Selection): boolean {
  const isMyBoard = isAlly(first) && isBoard(first)
  const targetsEnemyBoard = !isAlly(second) && isBoard(second)
  return isMyBoard && targetsEnemyBoard
}

export function isMoveSelection(first: Selection, second: Selection): boolean {
  const isMyBoard = isAlly(first) && isBoard(first)
  const isMyOtherBoard = isAlly(second) && isBoard(second) && first.index !== second.index
  return isMyBoard && isMyOtherBoard
}
