import React from 'react'

import {CardKey, getCardSrc} from './cards.ts'

const EMPTY_SPACE = '-'

interface CardTokenProps {
  cardKey: CardKey | null
  onClick?: () => void
}

export default function CardToken(props: CardTokenProps): JSX.Element {
  const {onClick, cardKey} = props

  if (cardKey == null) {
    return (
      <button>
        <span>{EMPTY_SPACE}</span>
      </button>
    )
  }
  const card = getCardSrc(cardKey)
  return (
    <button onClick={onClick}>
      <img src={card} alt={cardKey} />
    </button>
  )
}
