import React from 'react'

import type { GameHandle, Selection } from './types.ts'
import BoardSlot from './BoardSlot.tsx'
import CardToken from './cards/Card.tsx'
import {isAttackSelection, isMoveSelection, isPlayCardSelection} from './selection.tsx'

type GameProps = GameHandle

export default function Game({
  team,
	board,
	player,
	deck,
	enemyLife,
	enemyDeckSize,
	enemyHandSize,
	currentTurn,
	canDraw,
	hasDrawn,
	gameStatus,
  startTurn,
  endTurn,
  startDraw,
  commitDraw,
  attackCard,
  moveCard,
  playCard,
}: GameProps): JSX.Element {
  const [selection, setSelection] = React.useState<Selection | null>(null)

  function selectCard(nextSelection: Selection): void {
    if (!selection) {
      setSelection(nextSelection)
    } else {
      if (isAttackSelection(selection, nextSelection)) {
        attackCard(selection.index, nextSelection.index)
      } else if (isMoveSelection(selection, nextSelection)) {
        moveCard(selection.index, nextSelection.index)
      } else if (isPlayCardSelection(selection, nextSelection)) {
        playCard(selection.index, nextSelection.index)
      }
      setSelection(null)
    }
  }

  function selectTurnButton(): void {
  }

  const enemyBoard = team === 1 ? board.scourge : board.sentinal
  const allyBoard = team === 1 ? board.sentinal : board.scourge

  return (
    <div className="game-container">
      <div className="game-sidebar">
        <div className="player-info">
          <h4>Opponent</h4>
          <p>Life: {enemyLife}</p>
          <p>Deck: {enemyDeckSize}</p>
        </div>
        <p>Turn: {currentTurn}</p>
        {canDraw && <p>Drawing phase...</p>}
        {hasDrawn && <p>Action phase...</p>}
        <button onClick={selectTurnButton}>End/Start Turn</button>
        <div className="player-info">
          <p>Life: {player.life}</p>
          <p>Deck: {deck.length}</p>
        </div>
      </div>
      <div className="game-board">
        <div className="hand">
          {Array(enemyHandSize).fill(null).map(() => (
            <CardToken cardKey={null} />
          ))}
        </div>
        <div className="fighter-area enemy">
          {enemyBoard.map((card, index) => (
            <BoardSlot
              card={card ?? null}
              onSelect={() => selectCard({target: 'opponent', type: 'board', index})}
            />
          ))}
        </div>
        <div className="fighter-area ally">
          {allyBoard.map((card, index) => (
            <BoardSlot
              card={card ?? null}
              onSelect={() => selectCard({target: 'ally', type: 'board', index})}
            />
          ))}
        </div>
        <div className="hand">
          {player.hand.map((card, index) => (
            <CardToken
              cardKey={card.id}
              onSelect={() => selectCard({target: 'ally', type: 'hand', index})}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
