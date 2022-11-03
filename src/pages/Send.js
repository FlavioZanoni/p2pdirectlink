import { useEffect, useState, useContext } from "react";
import DropFile from "../components/DropFile";
import { initializePeer } from "../lib/initializers";
import { SHA1 } from "crypto-js";
import { Btn, WaitBtn } from "../components/Button";
import SocketContext from "../lib/socket";
import sendWorker from "../lib/sendWorker.js";
const peer = initializePeer(true, false)

export default function Send() {
    const socket = useContext(SocketContext);
    const [id, setId] = useState('')
    const [connected, setConnected] = useState(false)
    const worker = new Worker(sendWorker);

    useEffect(() => {
        socket.on("connect", () => {
            console.log('[io] => connected on the serverside')
            console.log("[io] => socket id = ", socket.id)
            setId(SHA1(socket.id).toString().slice(0, 5))
            sendUser(SHA1(socket.id).toString().slice(0, 5))
        })
        peer.on('signal', data => {
            listen(data)
        })
    }, [])

    // sends the connection id, its own id, and if its an initiator or not
    const sendUser = (id) => {
        socket.emit('user', {
            initiator: true,
            id: socket.id,
            hash: '#' + id
        })
    }

    const listen = (peerData) => {

        socket.on("needData", (id) => {
            socket.emit("hostData", id, {
                id: socket.id,
                data: peerData,
                hash: "#" + id
            })
        })

        socket.on('receiverConnect', (host) => {
            console.log("user receiver data: ", host)
            peer.signal(host)
            peer.on('connect', () => {
                setConnected(true)
                console.log("[peerHost] = Connected with peer receiver")
                window.alert("receiver connected")
                // terminates the socket
                socket.disconnect(
                    console.log("socket terminated")
                )
            })
        })
    }

    const handleSubmit = async () => {
        for (let c = 0; c < files.length; c++) {
            const buffered = await files[c].arrayBuffer()

            if (files[c].size < 200000) {
                console.log('sended')
                peer.write(JSON.stringify({ name: files[c].name, type: files[c].type }), { encoding: 'utf-8' })
                peer.write(new Uint8Array(buffered))
                peer.send(`d`)
            } else {
                worker.postMessage(files[c], [buffered])
            }

            worker.onmessage = msg => {
                if (msg.data !== "d") {
                    const buffer = msg.data
                    const view = new Uint8Array(buffer)
                    peer.write(view)
                } else {
                    peer.write('d')
                }
            }
        }
    }

    const [files, setFiles] = useState([])

    return (
        <div className="text-center flex flex-col justify-center items-center mx-auto">
            <DropFile files={files} setFiles={setFiles} />
            <p>your link:</p>
            <p className="w-[36rem] p-2 rounded-md bg-[#C4C4C4]" >{`http://localhost:3000/receive#${id}`}</p>
            <a target="_blank" rel="noreferrer" href={`http://localhost:3000/receive#${id}`}>link</a>

            {
                connected
                    ? files.length === 0
                        ? <WaitBtn content={"Peer connected, input at least one file."} />
                        : <Btn content={'Send'} func={handleSubmit} />
                    : <WaitBtn content={"Waiting other peer to connect..."} />
            }
        </div>
    )
}