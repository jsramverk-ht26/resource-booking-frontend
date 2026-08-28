import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export function useSocket(events) {
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io(API_URL)
    socketRef.current = socket

    for (const [event, handler] of Object.entries(events)) {
      socket.on(event, handler)
    }

    return () => socket.disconnect()
  }, [])

  return socketRef
}
