import React from 'react'

import type { GameHandle, Selection } from './types.ts'
import BoardSlot from './BoardSlot.tsx'
import CardToken from './cards/Card.tsx'
import {
  isAttackSelection,
  isMoveSelection,
  isPlayCardSelection,
  isAlly,
  isBoard,
  isHand,
} from './selection.tsx'

type GameProps = GameHandle

const GAME_STATUS_SENTINAL_WIN = 4
const GAME_STATUS_SCOURGE_WIN = 5

export default function Game(props: GameProps): JSX.Element {
  const {
    team,
    board,
    player,
    deckSize,
    enemyLife,
    enemyDeckSize,
    enemyHandSize,
    currentTurn,
    canDraw,
    hasDrawn,
    gameStatus,
    drawChoices,
    startTurn,
    endTurn,
    startDraw,
    commitDraw,
    attackCard,
    moveCard,
    playCard,
    getView,
  } = props
  const [selection, setSelection] = React.useState<Selection | null>(null)

  function selectCard(nextSelection: Selection): void {
    if (selection === null) {
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

  React.useEffect(() => {
    if (currentTurn === team) {
      startTurn()
    }
  }, [currentTurn, startTurn])

  const enemyBoard = team === 1 ? board.scourge : board.sentinal
  const allyBoard = team === 1 ? board.sentinal : board.scourge
  const isMyTurn = currentTurn === team

  const maybeIsGameWinner =
    gameStatus === GAME_STATUS_SCOURGE_WIN || gameStatus === GAME_STATUS_SENTINAL_WIN ? (
      team === 1
        ? gameStatus === GAME_STATUS_SENTINAL_WIN
        : gameStatus === GAME_STATUS_SCOURGE_WIN
    ) : null

  return (
    <div className="game-container">
      <div className="game-sidebar">
        <div className="player-info">
          <h4>Opponent</h4>
          <p>Life: {enemyLife}</p>
          <p>Deck: {enemyDeckSize}</p>
        </div>
        {maybeIsGameWinner === null ? (
          <div>
            <p>{isMyTurn ? 'My' : 'Enemy'} Turn</p>
            {isMyTurn && canDraw && <button type="button" onClick={startDraw}>Start Draw</button>}
            {isMyTurn && hasDrawn && <button type="button" onClick={endTurn}>End Turn</button>}
          </div>
        ) : (
          <div>
            {maybeIsGameWinner ? "You Win!" : "You Lose!"}
          </div>
        )}
        <div className="player-info">
          <p>Life: {player.life}</p>
          <p>Deck: {deckSize}</p>
        </div>
      </div>
      <div className="game-board">
        <div className="hand">
          {Array(enemyHandSize).fill(null).map((_, i) => (
            <CardToken
              key={`enemy-hand-${i}`}
              cardKey={null}
              isSelected={false}
              disabled
            />
          ))}
        </div>
        <div className="fighter-area enemy">
          {enemyBoard.map((card, index) => (
            <BoardSlot
              key={`enemy-${index}`}
              card={card ?? null}
              onSelect={() => selectCard({target: 'opponent', type: 'board', index})}
              isSelected={
                selection
                  ? !isAlly(selection) && isBoard(selection) && selection.index === index
                  : false
              }
              disabled={!(currentTurn === team && hasDrawn)}
            />
          ))}
        </div>
        <div className="fighter-area ally">
          {allyBoard.map((card, index) => (
            <BoardSlot
              key={`ally-${index}`}
              card={card ?? null}
              onSelect={() => selectCard({target: 'ally', type: 'board', index})}
              isSelected={
                selection
                  ? isAlly(selection) && isBoard(selection) && selection.index === index
                  : false
              }
              disabled={!(currentTurn === team && hasDrawn)}
            />
          ))}
        </div>
        {drawChoices.length > 0 && (
          <React.Fragment>
            <div className="draw-choices">
              {drawChoices.map((card, index) => (
                <CardToken
                  key={`draw-choices-${index}`}
                  cardKey={card.type === -1 ? null : card.type}
                  onSelect={() => selectCard({target: 'ally', type: 'draws', index})}
                  isSelected={
                    selection
                      ? selection.type === 'draws' && selection.index === index
                      : false
                  }
                  disabled={false}
                />
              ))}
            </div>
            <div>
              <button
                type="button"
                onClick={
                  () => selection && selection.type === 'draws' && commitDraw(selection.index)
                }
                disabled={selection?.type !== 'draws'}
              >
                Draw Card
              </button>
            </div>
          </React.Fragment>
        )}
        <div className="hand">
          {player.hand.map((card, index) => (
            <CardToken
              key={`hand-${index}`}
              cardKey={card.type === -1 ? null : card.type}
              onSelect={() => selectCard({target: 'ally', type: 'hand', index})}
              isSelected={
                selection
                  ? isAlly(selection) && isHand(selection) && selection.index === index
                  : false
              }
              disabled={!(isMyTurn && hasDrawn)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
