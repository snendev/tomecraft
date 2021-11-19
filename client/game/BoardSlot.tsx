import React from 'react'

import type {Card} from './types.ts'
import CardToken from './cards/Card.tsx'
import {EMPTY_SPACE, EMPTY_VALUE} from './cards/constants.ts'

interface CardTokenProps {
  card: Card | null
  onSelect: () => void
  isSelected: boolean
  disabled: boolean
}

export default function BoardSlot(props: CardTokenProps): JSX.Element {
  const {onSelect, card, isSelected, disabled} = props

  if (card === null || card.type === EMPTY_VALUE) {
    return (
      <button
        type="button"
        className={`board-card${isSelected ? ' selected' : ''}`}
        onClick={onSelect}
        disabled={disabled}
      >
        <span>{EMPTY_SPACE}</span>
      </button>
    )
  }
  return (
    <div className="board-slot">
      <CardToken
        card={card}
        onSelect={onSelect}
        isSelected={isSelected}
        disabled={disabled}
      />
      <span>{card.power}</span>
    </div>
  )
}
