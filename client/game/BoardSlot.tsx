import React from 'react'

import type {Card} from './types.ts'
import CardToken from './cards/Card.tsx'

const EMPTY_SPACE = '-'

interface CardTokenProps {
  card: Card | null
  onSelect: () => void
}

export default function BoardSlot(props: CardTokenProps): JSX.Element {
  const {onSelect, card} = props

  if (card == null) {
    return (
      <button>
        <span>{EMPTY_SPACE}</span>
      </button>
    )
  }
  return (
    <CardToken onSelect={onSelect} cardKey={card.id} />
  )
}
