import React from 'react'

import type {Card} from '../types.ts'

import {EMPTY_SPACE, EMPTY_VALUE} from './constants.ts'

interface CardTokenProps {
  card: Card | null
  onSelect?: () => void
  isSelected: boolean
  disabled: boolean
}

export default function CardToken(props: CardTokenProps): JSX.Element {
  const {onSelect, card, isSelected, disabled} = props
  if (card === null || card.type == EMPTY_VALUE) {
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
      <div className={`card-token${disabled ? ' disabled' : ''}`}>
        <div>
          {card.type}
        </div>
        <div>
          {card.base_power}
        </div>
      </div>
    </button>
  )
}
