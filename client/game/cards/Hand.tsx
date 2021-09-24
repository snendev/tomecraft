import React from 'react'

import {CardInstance} from '../types.ts'

import Card from './Card.tsx'

interface HandProps {
  cards: CardInstance[]
}

export default function Hand(props: HandProps): JSX.Element {
  const {cards} = props
  return (
    <>
      {cards.map((card) => <Card cardKey={card.key} />)}
    </>
  )
}
