import React from 'react'

import assertNever from '~/common/assertNever.ts'

import Loading from '../components/Loading.tsx'

import {
  AsyncHandle,
  Card,
  FighterArea,
  GameState,
  GameAction,
  GameCommandAPI,
} from './types.ts'
import useServerSocket from './useServerSocket.ts'
import Game from './Game.tsx'

interface GameClientState extends GameState {
  isDrawing: boolean
}

type GameClientAction = GameAction

function reducer(state: GameClientState, action: GameClientAction): GameClientState {
  switch (action.type) {
    case 'update-state': {
      return {...state, ...action.state}
    }
    case 'set-player-team': {
      return {...state, team: action.team}
    }
    case 'play-card': {
      const nextHand = [
        ...state.player.hand.slice(0, action.handIndex),
        ...state.player.hand.slice(action.handIndex + 1),
      ]
      return {
        ...state,
        player: { ...state.player, hand: nextHand },
      }
    }
    case 'receive-cards': {
      // first, i can draw and i am not yet drawing
      // scry N cards from the deck
      if (state.canDraw && !state.isDrawing) {
        return {
          ...state,
          isDrawing: true,
          drawChoices: action.cards,
        }
      }
      // then, i am drawing, i can still draw, and I haven't yet drawn.
      // i draw a card into my hand
      if (state.canDraw && state.isDrawing && !state.hasDrawn) {
        return {
          ...state,
          drawChoices: [],
          player: {
            ...state.player,
            hand: action.cards
          },
          isDrawing: false,
          hasDrawn: true,
        }
      }
      // then, i am no longer drawing and cannot draw. this is the board.
      const team = state.team === 1 ? 'sentinal' : 'scourge' as const
      return {
        ...state,
        board: {
          ...state.board,
          [team]: action.cards,
        },
      }
    }
    default: return state
  }
}

const initialState: GameClientState = {
	board: {
    sentinal: Array(4).fill(undefined) as FighterArea,
    scourge: Array(4).fill(undefined) as FighterArea,
  },
	player: {
    name: '',
    id: -1,
    hand: [],
    life: -1,
    ready: false,
  },
	deckSize: 0,
  team: 1,
	enemyLife: 0,
	enemyDeckSize: 0,
	enemyHandSize: 0,
	currentTurn: 0,
	canDraw: false,
	hasDrawn: false,
	gameStatus: 0,
  isDrawing: false,
  drawChoices: [],
}

export default function GameClient(): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const handleGameUpdate = React.useCallback((action: GameAction) => {
    dispatch(action)
  }, [])

  const socketHandle = useServerSocket(handleGameUpdate)

  const {team} = state
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
              player_id: team,
            })
          },
          startTurn: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 's',
              player_id: team,
            })
          },
          endTurn: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 'e',
              player_id: team,
            })
          },
          getView: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 's',
              cmd: 'g',
              player_id: team,
            })
          },
          startDraw: () => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: 's',
              player_id: team,
            })
          },
          commitDraw: (cardIndex: number) => {
            if (socketHandle.status !== 'connected') return
            // dispatch({type})
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `d ${cardIndex}`,
              player_id: team,
            })
          },
          playCard: (handIndex: number, positionIndex: number) => {
            if (socketHandle.status !== 'connected') return
            dispatch({ type: 'play-card', handIndex })
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `p ${handIndex} ${positionIndex}`,
              player_id: team,
            })
          },
          moveCard: (positionFrom: number, positionTo: number) => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `m ${positionFrom} ${positionTo}`,
              player_id: team,
            })
          },
          attackCard: (positionFrom: number, positionTo: number) => {
            if (socketHandle.status !== 'connected') return
            socketHandle.handle.sendGameCommand({
              type: 'a',
              cmd: `a ${positionFrom} ${positionTo}`,
              player_id: team,
            })
          },
        },
      }
    },
    [socketHandle, team],
  )

  React.useEffect(() => {
    if (gameHandle.status !== 'connected') return
    const intervalId = setInterval(() => {
      gameHandle.handle.getView()
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [gameHandle])

  React.useEffect(() => {
    if (gameHandle.status !== 'connected') return
    gameHandle.handle.readyPlayer()
    gameHandle.handle.readyPlayer()
  }, [gameHandle, team])

  switch (gameHandle.status) {
    case 'connected': {
      return <Game {...state} {...gameHandle.handle} />
    }
    case 'not-connected':
    case 'connecting': {
      return <Loading />
    }
    default: return assertNever(gameHandle)
  }
}
