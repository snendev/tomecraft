import React from 'react'

import type {Card} from './types.ts'
import CardToken from './cards/Card.tsx'

const EMPTY_SPACE = '-'

interface CardTokenProps {
  card: Card | null
  onSelect: () => void
  isSelected: boolean
  disabled: boolean
}

export default function BoardSlot(props: CardTokenProps): JSX.Element {
  const {onSelect, card, isSelected, disabled} = props

  if (card === null || card.type === -1) {
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
        cardKey={card.type}
        onSelect={onSelect}
        isSelected={isSelected}
        disabled={disabled}
      />
      <span>{card.power}</span>
    </div>
  )
}
