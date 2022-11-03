import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { convertToDataUrl } from "../lib/converters"
import { initializePeer } from "../lib/initializers"
import receiveWorker from "../lib/receiveWorker.js"
import SocketContext from "../lib/socket"

const peer = initializePeer(false, false)

export default function Receive() {
	const worker = new Worker(receiveWorker)

	const socket = useContext(SocketContext)
	const [notFound, setNotFound] = useState(false)
	const [urls, setUrls] = useState([])
	const [fileNames, setFileNames] = useState([])


	useEffect(() => {
		let hash = window.location.hash
		socket.on("connect", () => {
			console.log("[io] => connected on the serverside")
			console.log("[io] => socket id = ", socket.id)
			sendUser(hash)
		})
		listen()
	}, [])

	const sendUser = (hash) => {
		console.log(socket.id)
		socket.emit("user", {
			initiator: false,
			id: socket.id,
			hash: hash
		})
	}

	const listen = () => {
		socket.on("accepted", () => {
			console.log("id maches database")
		})

		socket.on("notFound", () => {
			setNotFound(true)
		})

		socket.on("hostData", host => {
			console.log("Here is the host data: ", host.data)
			//makes the receiver data
			peer.signal(host.data)

			peer.on("signal", (data) => {
				// emits the receiver data and the host id
				console.log(data)
				socket.emit("receiverData", host.id, data)

				peer.on("connect", () => {
					console.log("[peerReceiver] = Connected with peer host")
					// terminates the socket
					socket.disconnect(
						console.log("socket terminated")
					)
				})
			})
		})
		const uintArr = []
		let props
		peer.on("data", (data) => {
			if (uintArr.length === 0 && !props) {
				props = new TextDecoder("utf-8").decode(data)
				return
			}
			if (data.length == 1 && data[0] == 100) {
				console.log("file is done")
				worker.postMessage({ data: uintArr, props: props })
			} else {
				uintArr.push(data)
			}
		})
	}

	worker.onmessage = async msg => {
		const result = msg.data.blob
		const link = await convertToDataUrl(result)
		setUrls([...urls, link])
		setFileNames([...fileNames, msg.data.name])
	}

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
							urls.length !== 0 ? (
								urls.map((url, idx) => {
									return (
										<div key={idx}>
											<img src={url} alt={fileNames[idx]} />
											<a download={fileNames[idx]} href={url}> Download</a>
										</div>
									)
								})

							) : <p>there is no file</p>
						}
					</div>
				)
			}

		</div>
	)
}