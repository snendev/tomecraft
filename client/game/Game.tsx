import React, { useEffect } from 'react'

import useSocket from './useSocket.ts'
import {CardInstance} from './types.ts'

interface GameActionsContextValue {}

const GameActionsContext = React.createContext<GameActionsContextValue | null>(null)

interface GameClientState {
  player_id: string
  match_id: string
  result: string
}

interface BoardPosition {
  card: CardInstance | null
}

interface PlayerBoard {
  0: BoardPosition
  1: BoardPosition
  2: BoardPosition
  3: BoardPosition
}

interface GameState {
  self_board: PlayerBoard
  self_hand: CardInstance[]
  enemy_board: PlayerBoard
  enemy_hand: CardInstance[]
}

interface GameProps {

}

export default function Game(props: GameProps): JSX.Element {
  const [state, setState] = React.useState()

  // ensure this is stable wrt state so that onMessage does not have to be constantly reattached
  // const onMessage = React.useCallback(() => {}, [])

  // const handle = useSocket()

  return (
    <GameActionsContext.Provider value={{}}>
      <div>Hello world!</div>
    </GameActionsContext.Provider>
  )
}
