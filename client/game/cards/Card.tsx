import React from 'react'

import type {CardKey} from '../types.ts'

import {getCardAlt, getCardSrc} from './cards.ts'

const EMPTY_SPACE = '-'

interface CardTokenProps {
  cardKey: CardKey | null
  onSelect?: () => void
}

export default function CardToken(props: CardTokenProps): JSX.Element {
  const {onSelect, cardKey} = props

  if (cardKey == null) {
    return (
      <div>
        <span>{EMPTY_SPACE}</span>
      </div>
    )
  }
  return (
    <button onClick={onSelect}>
      <img
        src={getCardSrc(cardKey)}
        alt={getCardAlt(cardKey)}
      />
    </button>
  )
}
