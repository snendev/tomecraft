import React from 'react'
import useWebSocket from 'react-use-websocket'

import assertNever from '~/common/assertNever.ts'

import { useUser } from '../user.tsx'

import { AsyncHandle, GameCommand, GameAction } from './types.ts'

const MY_ID = (function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
})()

function shouldReconnect() {
  console.log('Reconnecting...')
  return true
}

// session commands
// query, join, leave, play (game command), poll
interface SessionCommandAPI {
  query: () => void
  join: () => void
  leave: () => void
  play: () => void
  poll: () => void
}

interface SocketMessage {
  command: keyof SessionCommandAPI
  // required unless command === 'query'
  match_id?: string
  player_id?: string
  // only present if command === 'play'
  game_command?: GameCommand
}

type GameSocketSessionState =
  | { status: 'not-connected' }
  | { status: 'connecting' }
  | { status: 'finding-game' }
  | { status: 'joining-game'; playerId: string; matchId: string }
  | { status: 'in-game'; playerId: string; matchId: string }

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'find-game'; playerId: string; matchId: string }
  | { type: 'join-game' }

function reducer(state: GameSocketSessionState, action: Action): GameSocketSessionState {
  switch (action.type) {
    case 'open': {
      if (state.status !== 'connecting') return state
      return { status: 'finding-game' }
    }
    case 'find-game': {
      if (state.status !== 'finding-game') return state
      return { status: 'joining-game', matchId: action.matchId, playerId: action.playerId }
    }
    case 'join-game': {
      if (state.status !== 'joining-game') return state
      return { ...state, status: 'in-game' }
    }
    case 'close': {
      return { status: 'not-connected' }
    }
    default: return assertNever(action)
  }
}

const initialState: GameSocketSessionState = {status: 'connecting'}

interface SocketHandle {
  sendGameCommand: (command: GameCommand) => void
}

export default function useServerSocket(
  onUpdate: (action: GameAction) => void
): AsyncHandle<SocketHandle> {
  const profile = useUser()
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // prep socket

  const onMessage = React.useCallback((message: WebSocketEventMap['message']) => {
    const data = JSON.parse(message.data)
    switch (data.result) {
      case 'found': {
        dispatch({
          type: 'find-game',
          matchId: data.match_id,
          playerId: data.player_id,
        })
        return
      }
      case 'joined p1': {
        onUpdate({ type: 'set-player-team', team: 1 })
        dispatch ({ type: 'join-game' })
        return
      }
      case 'joined p2': {
        onUpdate({ type: 'set-player-team', team: 2 })
        dispatch ({ type: 'join-game' })
        return
      }
      case 'played': {
        switch (data.game_result.result_type) {
          case 'a': {
            const result = data.game_result.action_result
            if (result) onUpdate({
              type: 'receive-cards',
              cards: result.cards,
            })
            return
          }
          case 's': {
            const result = data.game_result.state_result
            if (result) onUpdate({
              type: 'update-state',
              state: {
                board: result.board,
                player: result.player,
                deck: result.deck,
                enemyLife: result.enemy_life,
                enemyDeckSize: result.enemy_deck_size,
                enemyHandSize: result.enemy_hand_size,
                currentTurn: result.current_turn,
                canDraw: result.can_draw,
                hasDrawn: result.has_drawn,
                gameStatus: result.game_status,
              },
            })
            return
          }
          default: return
        }
      }
      default: return;
    }
  }, [onUpdate])

  const onOpen = React.useCallback(() => {
    console.log('socket opened')
    dispatch({type: 'open'})
  }, [])
  
  const onError = React.useCallback((event: WebSocketEventMap['error']) => {
    console.error(event)
  }, [])
  
  const onClose = React.useCallback((_event: WebSocketEventMap['close']) => {
    console.log('socket closed')
    dispatch({type: 'close'})
  }, [])

  const url = React.useMemo(
    () => `ws://localhost:7636/ws`,
    [profile],
  )

  const {sendJsonMessage} = useWebSocket(
    url,
    {onMessage, onOpen, onError, onClose, shouldReconnect},
  )

  // convenient type-safe wrapper
  const sendJson = React.useCallback((message: SocketMessage) => {
    sendJsonMessage(message)
  }, [sendJsonMessage])

  const sendGameCommand = React.useCallback((gameCommand: GameCommand) => {
    if (state.status !== 'in-game') return
    sendJson({
      player_id: MY_ID,
      match_id: state.matchId,
      command: 'play',
      game_command: gameCommand,
    })
  }, [state, sendJson])

  // effects to push the coordinator along

  React.useEffect(() => {
    if (state.status !== 'finding-game') return
    sendJson({command: 'query', player_id: MY_ID})
  }, [sendJson, state.status])

  React.useEffect(() => {
    if (state.status !== 'joining-game') return
    sendJson({command: 'join', player_id: state.playerId, match_id: state.matchId})
  }, [sendJson, state])

  // return game command handler in wrapper

  const handle = React.useMemo<AsyncHandle<SocketHandle>>(() => {
    switch (state.status) {
      case 'in-game': {
        return {status: 'connected', handle: {sendGameCommand}}
      }
      case 'finding-game':
      case 'joining-game': {
        return {status: 'connecting'}
      }
      case 'connecting':
      case 'not-connected': {
        return state
      }
      default: return assertNever(state)
    }
  }, [sendGameCommand])

  return handle
}
