import { SHA1 } from "crypto-js"
import React, { useEffect, useState } from "react"
import { Btn, WaitBtn } from "../components/Button"
import { DropFile } from "../components/DropFile"
import { usePeerContext } from "../lib/peerContext/usePeerContext"
import sendWorker from "../lib/sendWorker"
import { PeerDataType } from "../lib/sharedTypes"
import { useSocketContext } from "../lib/socketContext/useSocketContext"

export default function Send() {
  const { peer, peerData } = usePeerContext()
  const { socket, socketConnected } = useSocketContext()
  const [connected, setConnected] = useState(false)
  const [id, setId] = useState("")
  const worker = new Worker(sendWorker)
  const [files, setFiles] = useState<Array<File>>([])

  useEffect(() => {
    if (socketConnected) {
      setId(
        SHA1(socket?.id as string)
          .toString()
          .slice(0, 5)
      )
      sendUser(
        SHA1(socket?.id as string)
          .toString()
          .slice(0, 5)
      )
    }
  }, [socketConnected])

  useEffect(() => {
    if (peerData) {
      listen(peerData)
    }
  }, [peerData])

  // sends the connection id, its own id, and if its an initiator or not
  const sendUser = (id: string) => {
    socket?.emit("user", {
      initiator: true,
      id: socket.id,
      hash: "#" + id,
    })
  }

  const listen = (peerData: PeerDataType) => {
    socket?.on("needData", (id) => {
      socket?.emit("hostData", id, {
        id: socket?.id,
        data: peerData,
        hash: "#" + id,
      })
    })

    socket?.on("receiverConnect", (host) => {
      console.log("user receiver data: ", host)
      peer?.signal(host)
      peer?.on("connect", () => {
        setConnected(true)
        console.log("[peerHost] = Connected with peer receiver")
        window.alert("receiver connected")
        // terminates the socket
        socket?.disconnect()
        console.log("socket terminated")
      })
    })
  }

  const handleSubmit = async () => {
    for (let c = 0; c < files.length; c++) {
      const buffered = await files[c].arrayBuffer()

      peer?.write(
        JSON.stringify({ name: files[c].name, type: files[c].type }),
        { encoding: "utf-8" }
      )

      if (files[c].size < 200000) {
        console.log("sended")
        peer?.write(new Uint8Array(buffered))
        peer?.send("d")
      } else {
        worker.postMessage(files[c], [buffered])
      }

      worker.onmessage = (msg) => {
        if (msg.data !== "d") {
          const buffer = msg.data
          const view = new Uint8Array(buffer)
          peer?.write(view)
        } else {
          peer?.write("d")
        }
      }
    }
  }

  return (
    <div className="text-center flex flex-col justify-center items-center mx-auto">
      <DropFile files={files} setFiles={setFiles} />
      <p>your link:</p>
      <p className="w-[36rem] p-2 rounded-md bg-[#C4C4C4]">{`http://localhost:5173/receive#${id}`}</p>
      <a
        target="_blank"
        rel="noreferrer"
        href={`http://localhost:5173/receive#${id}`}
      >
        link
      </a>

      {connected ? (
        files.length === 0 ? (
          <WaitBtn content={"Peer connected, input at least one file."} />
        ) : (
          <Btn content={"Send"} func={handleSubmit} />
        )
      ) : (
        <WaitBtn content={"Waiting other peer to connect..."} />
      )}
    </div>
  )
}
