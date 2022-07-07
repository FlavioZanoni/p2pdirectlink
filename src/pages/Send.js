import { useEffect, useState } from "react";
import DropFile from "../components/DropFile";
import { initializePeer, initializeSocket } from "../lib/initializers";
import { SHA1 } from "crypto-js";

const socket = initializeSocket()
const peer = initializePeer(true, false)

export default function Send() {

    const [id, setId] = useState('')

    socket.on("connect", () => {
        console.log('[io] => connected on the serverside')
        console.log("[io] => socket id = ", socket.id)
        listen(SHA1(socket.id).toString().slice(0, 5))
        setId(SHA1(socket.id).toString().slice(0, 5))
    })
    function listen(id) {

        let peerData = ''
        // sends the connection id, its own id, and if its an initiator or not
        socket.emit('user', {
            initiator: true,
            id: socket.id,
            hash: '#' + id
        })

        peer.on('signal', data => {
            peerData = data
            console.log(data)
        })
        socket.on("needData", (id) => {
            console.log('needData')
            socket.emit("hostData", id, {
                id: socket.id,
                data: peerData,
                hash: "#" + id
            })
        })

        socket.on('receiverConnect', (user) => {
            console.log("user receiver data: ", user)
            peer.signal(user)
            peer.on('connect', () => {
                console.log("[peerHost] = Connected with peer receiver")
                window.alert("receiver connected")
                // terminates the socket
                socket.disconnect(
                    console.log("socket terminated")
                )
            })
        })
    }

    return (
        <>
            <DropFile />
            <a target="_blank" rel="noreferrer" href={`http://localhost:3000/receive#${id}`}>link</a>
        </>
    )
}

