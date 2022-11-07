import React, { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"

export type SocketContextType = {
  socket?: Socket
  socketConnected: boolean
  socketError: boolean
  socketDisconnected: boolean
}

type Props = {
  children: React.ReactNode
}

export const SocketContext = React.createContext({} as SocketContextType)

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socketConnected, setSocketConnected] = useState(false)
  const [socketError, setSocketError] = useState(false)
  const [socketDisconnected, setSocketDisconnected] = useState(false)
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    setSocket(io("localhost:8080", { transports: ["websocket"] }))
  }, [])

  socket?.on("connect", () => {
    console.log("[io] => connected on the serverside")
    console.log("[io] => socket id = ", socket.id)
    setSocketConnected(true)
  })

  socket?.on("error", (err) => {
    console.log("[io] => Error on socket")
    console.log("[io] => error = ", err)
    setSocketError(true)
  })

  socket?.on("disconnect", () => {
    console.log("[io] => diconnected from the serverside")
    setSocketDisconnected(true)
  })

  const values = {
    socket,
    socketConnected,
    socketError,
    socketDisconnected,
  }

  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  )
}

export default SocketContext
