import { useEffect, useContext, useState } from "react";
import { initializePeer } from "../lib/initializers";
import SocketContext from "../lib/socket";
import { Link } from "react-router-dom";

const peer = initializePeer(false, false)

export default function Receive() {
    const socket = useContext(SocketContext);
    const [file, setFile] = useState(false)
    const [notFound, setNotFound] = useState(false)
    useEffect(() => {
        let hash = window.location.hash
        socket.on("connect", () => {
            console.log('[io] => connected on the serverside')
            console.log("[io] => socket id = ", socket.id)
            sendUser(hash)
        })
        listen()
    }, [])

    const sendUser = (hash) => {
        console.log(socket.id)
        socket.emit('user', {
            initiator: false,
            id: socket.id,
            hash: hash
        })
    }

    const listen = () => {
        socket.on('accepted', () => {
            console.log("id maches database")
        })

        socket.on('notFound', () => {
            setNotFound(true)
        })

        socket.on('hostData', host => {
            console.log("Here is the host data: ", host.data)
            //makes the receiver data
            peer.signal(host.data)

            peer.on('signal', (data) => {
                // emits the receiver data and the host id
                console.log(data)
                socket.emit('receiverData', host.id, data)

                peer.on('connect', () => {
                    console.log("[peerReceiver] = Connected with peer host")
                    // terminates the socket
                    socket.disconnect(
                        console.log("socket terminated")
                    )
                })
            })
        })

        let uintArr = []
        peer.on('data', (data) => {
            console.log(data)
            //checks if the final message is an unit8 array of the letter "d" sent as the last message
            if (data.length === 1 && data[0] === 100) {
                console.log("file is done")
                decode(uintArr)
            } else {
                uintArr.push(data)
            }

            function decode(arrays) {
                // sum of individual array lengths
                let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

                if (!arrays.length) return null;

                let result = new Uint8Array(totalLength);

                // for each array - copy it over result
                // next array is copied right after the previous one
                let length = 0;
                for (let array of arrays) {
                    result.set(array, length);
                    length += array.length;
                }
                console.log("res", result)
                let link = new TextDecoder("utf-8").decode(result)
                setUrl(link)
                console.log(link)
                setFile(true)
            }
        })
    }

    const [url, setUrl] = useState('')

    return (
        <div className="text-center flex flex-col justify-center mx-auto">


            {
                notFound ? (
                    <>
                        <div className="flex flex-col bg bg-[#333333] ba h-[12rem] w-[24rem] justify-center items-center p-4 text-yellow-50 rounded-lg">
                            <h2 className="text-red-500 font-semibold text-3xl mb-2"> This link is invalid </h2>
                            <p className="mb-2">This may be caused by:</p>
                            <ul className="flex flex-col text-justify">
                                <li> - Wrong link</li>
                                <li> - Host user has disconnected</li>
                                <li> - Server error</li>
                            </ul>
                        </div>

                        <Link to="/" className="p-2 mt-2 bg-[#00FF65] rounded-lg hover:bg-[#27D36B] duration-100 ease-in-out">
                            Main Page
                        </Link>
                    </>

                ) : (
                    <div className="flex bg-[#333333] h-[24rem] w-[48rem] justify-center items-center">

                        {
                            file ? (
                                <div>
                                    <img src={url} alt="uploaded image" />
                                    <a download='peerFile' href={url}> Download</a>
                                </div>
                            )
                                : <p>Waiting for file (later is an animation)</p>
                        }
                    </div>
                )
            }

        </div>
    )
}