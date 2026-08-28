import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export function useSocket(events) {
  const socketRef = useRef(null)
  const eventsRef = useRef(events)

  useEffect(() => {
    eventsRef.current = events
  })

  useEffect(() => {
    const socket = io(API_URL)
    socketRef.current = socket

    for (const event of Object.keys(events)) {
      socket.on(event, (...args) => eventsRef.current[event]?.(...args))
    }

    return () => socket.disconnect()
  }, [])

  return socketRef
}
