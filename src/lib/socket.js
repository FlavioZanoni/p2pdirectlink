import React from "react"
import io from "socket.io-client"

export const socket = io("localhost:8080", { transports: ["websocket"] })

const SocketContext = React.createContext(socket)
export default SocketContext