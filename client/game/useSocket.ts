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

interface SocketAPI {}

type State =
  | { status: 'not-connected' }
  | { status: 'connecting' }
  | { status: 'connected'}

type Action = 'open' | 'close' | 'error'
function reducer(_state: State, action: Action): State {
  switch (action) {
    case 'open': return { status: 'connected' }
    case 'close': return { status: 'not-connected' }
    case 'error': return { status: 'connecting' }
    default: return assertNever(action)
  }
}

const initialState: State = {status: 'not-connected'}

export default function useSocket(): AsyncHandle<SocketAPI> {
  const _user = useUser()
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onMessage = React.useCallback((message: WebSocketEventMap['message']) => {
    const data = JSON.parse(message.data)
    dispatch({ type: 'update', ...data })
  }, [])

  const onOpen = React.useCallback(() => {
    console.log('socket opened')
    dispatch('open')
  }, [])
  
  const onError = React.useCallback((event: WebSocketEventMap['error']) => {
    console.error(event)
    dispatch('error')
  }, [])
  
  const onClose = React.useCallback((_event: WebSocketEventMap['close']) => {
    console.log('socket closed')
    dispatch('close')
  }, [])

  const url = React.useMemo(() =>
    `ws://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/api/ws?name=${name}`,
    [],
  )
  const socket = useWebSocket(
    url,
    {onMessage, onOpen, onError, onClose, shouldReconnect},
  )

  const handle = React.useMemo(() => ({
    sendJson: (value: {}) => socket.send(JSON.stringify(value)),
  }), [socket])

  switch (state.status) {
    case 'connected': {
      return {status: 'connected', handle}
    }
    case 'connecting':
    case 'not-connected':
      return state
    default: return assertNever(state)
  }
}
