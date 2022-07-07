import { useEffect, useState } from "react";
import { initializePeer, initializeSocket } from "../lib/initializers";

const socket = initializeSocket()
const peer = initializePeer(false, false)

export default function Receive() {

    useEffect(() => {
        let hash = window.location.hash
        socket.on("connect", () => {
            console.log('[io] => connected on the serverside')
            console.log("[io] => socket id = ", socket.id)
            listen(hash)
        })
    }, [])


    function listen(hash) {
        console.log(`listen`)
        console.log(process.env.REACT_APP_TESTE)
        // sends the connection id, its own id, and if its an initiator or not
        socket.emit('user', {
            initiator: false,
            id: socket.id,
            hash: hash
        })

        socket.on('accepted', () => {
            console.log("id maches database")
        })

        socket.on('hostData', (host) => {
            console.log("Here is the host data: ", host.data)
            peer.signal(host.data)
        })
    }

    return (
        <div>
            <p>receive.js</p>
        </div>
    )
}