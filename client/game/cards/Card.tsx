import React from 'react'

import type {CardKey} from '../types.ts'

import {getCardAlt, getCardSrc} from './cards.ts'

const EMPTY_SPACE = '-'

interface CardTokenProps {
  cardKey: CardKey | null
  onSelect?: () => void
  isSelected: boolean
  disabled: boolean
}

export default function CardToken(props: CardTokenProps): JSX.Element {
  const {onSelect, cardKey, isSelected, disabled} = props
  if (cardKey == null) {
    return (
      <div className={`card-button card-back${isSelected ? ' selected' : ''}`}>
        <div>
          <span>{EMPTY_SPACE}</span>
        </div>
      </div>
    )
  }
  return (
    <button
      type="button"
      className={`card-button${isSelected ? ' selected' : ''}`}
      onClick={onSelect}
      disabled={disabled}
    >
      <img
        className="card-image"
        src={getCardSrc(cardKey)}
        alt={getCardAlt(cardKey)}
      />
    </button>
  )
}
