import React from 'react'

import assertNever from '~/common/assertNever.ts'

import Loading from '../components/Loading.tsx'

import {
  AsyncHandle,
  FighterArea,
  GameState,
  GameAction,
  GameCommandAPI,
} from './types.ts'
import useServerSocket from './useServerSocket.ts'
import Game from './Game.tsx'

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'update-state': {
      return {...action.state, team: state.team}
    }
    case 'set-player': {
      return {...state, team: action.team}
    }
    default: return state
  }
}

const initialState: GameState = {
	board: {
    sentinal: Array(4).fill(undefined) as FighterArea,
    scourge: Array(4).fill(undefined) as FighterArea,
  },
	player: {
    name: '',
    id: 0,
    hand: [],
    life: 0,
    ready: false,
  },
	deck: [],
  team: 1,
	enemyLife: 0,
	enemyDeckSize: 0,
	enemyHandSize: 0,
	currentTurn: 1,
	canDraw: false,
	hasDrawn: false,
	gameStatus: 0,
}

export default function GameClient(): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const handleGameUpdate = React.useCallback((data: Record<string, unknown>) => {
    console.log(data)
  }, [])

  const socketHandle = useServerSocket(handleGameUpdate)

  const gameHandle = React.useMemo<AsyncHandle<GameCommandAPI>>(
    () => {
      if (socketHandle.status !== 'connected') return socketHandle
      return {
        status: 'connected',
        handle: {
          readyPlayer: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 'b',
            })
          },
          startTurn: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 's',
            })
          },
          endTurn: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 'e',
            })
          },
          getView: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 'g',
            })
          },
          startDraw: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: 's',
            })
          },
          commitDraw: (cardIndex: number) => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `d ${cardIndex}`,
            })
          },
          playCard: (handIndex: number, positionIndex: number) => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `p ${handIndex} ${positionIndex}`,
            })
          },
          moveCard: (positionFrom: number, positionTo: number) => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `m ${positionFrom} ${positionTo}`,
            })
          },
          attackCard: (positionFrom: number, positionTo: number) => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `a ${positionFrom} ${positionTo}`,
            })
          },
        },
      }
    },
    [socketHandle, state],
  )

  React.useEffect(() => {
    if (gameHandle.status !== 'connected') return
    gameHandle.handle.readyPlayer()
    if (state?.team === 1) gameHandle.handle.startTurn()
  }, [gameHandle, state?.team])

  switch (gameHandle.status) {
    case 'connected': {
      if (!state) return <Loading />
      return <Game {...state} {...gameHandle.handle} />
    }
    case 'not-connected':
    case 'connecting': {
      return <Loading />
    }
    default: return assertNever(gameHandle)
  }
}
