import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

/**
 * @returns the socket instance
 */
function initializeSocket() {
    const socket = io("localhost:8080", { transports: ["websocket"] })
    return socket
}

/**
 * @param {Boolean} initiator - is this the initiator peer ? true : false
 * @param {Boolean} trickle - has tricle capabilities ? true : false
 * @returns the peer instance
 */
function initializePeer(initiator, trickle,) {
    const peer = new SimplePeer({
        initiator: initiator,
        trickle: trickle,
        stream: false,
    })

    return peer
}


export {
    initializeSocket,
    initializePeer
}