import React from 'react'
import useWebSocket from 'react-use-websocket'

import assertNever from '~/common/assertNever.ts'

import { useUser } from '../user.tsx'

function shouldReconnect() {
  console.log('Reconnecting...')
  return true
}

type AsyncHandle<T> =
  | { status: 'not-connected' }
  | { status: 'connecting' }
  | { status: 'connected'; handle: T}

interface SessionCommandAPI {
  query: () => void
  join: () => void
  leave: () => void
  play: () => void
  poll: () => void
}

interface GameCommandAPI {
  act: () => void,
  getState: () => void,
  debug: () => void,
}

// TODO
type GameCommandEnum = 'a' | 's' | 'd'

interface SocketMessage {
  playerId?: string
  matchId?: string
  command: keyof SessionCommandAPI
  gameCommand?: {
    playerId: string
    type: GameCommandEnum,
    cmd: unknown
  }
}

type State =
  | { status: 'not-connected' }
  | { status: 'connecting' }
  | { status: 'finding-game' }
  | { status: 'in-game'; playerId: string; matchId: string }

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'error' }
  | { type: 'game-found'; matchId: string; playerId: string }

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'open': return { status: 'finding-game' }
    case 'game-found': return { status: 'in-game', matchId: action.matchId, playerId: action.playerId }
    case 'close': return { status: 'not-connected' }
    case 'error': return { status: 'connecting' }
    default: return assertNever(action)
  }
}

const initialState: State = {status: 'not-connected'}

export default function useSocket(): AsyncHandle<GameCommandAPI> {
  const profile = useUser()
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onMessage = React.useCallback((message: WebSocketEventMap['message']) => {
    const data = JSON.parse(message.data)
    dispatch({ type: 'update', ...data })
  }, [])

  const onOpen = React.useCallback(() => {
    console.log('socket opened')
    dispatch({type: 'open'})
  }, [])
  
  const onError = React.useCallback((event: WebSocketEventMap['error']) => {
    console.error(event)
    dispatch({type: 'error'})
  }, [])
  
  const onClose = React.useCallback((_event: WebSocketEventMap['close']) => {
    console.log('socket closed')
    dispatch({type: 'close'})
  }, [])

  const url = React.useMemo(
    // () => `ws://arcade.saintnet.tech:7636/ws?name=${profile.displayName}`,
    () => `ws://arcade.saintnet.tech:7636/ws`,
    [profile],
  )
  const socket = useWebSocket(
    url,
    {onMessage, onOpen, onError, onClose, shouldReconnect},
  )

  const sendJson = React.useCallback((message: SocketMessage) => {
    socket.send(JSON.stringify(message))
  }, [socket])

  const handle = React.useMemo(() => ({
    // session commands
    query: () => {},
    join: () => {},
    leave: () => {},
    play: () => {},
    poll: () => {},
    // game commands
    act: () => {},
    getState: () => {},
    debug: () => {},
  }), [sendJson])

  switch (state.status) {
    case 'in-game': {
      return {status: 'connected', handle}
    }
    case 'finding-game': {
      return {status: 'connecting'}
    }
    case 'connecting':
    case 'not-connected':
      return state
    default: return assertNever(state)
  }
}
