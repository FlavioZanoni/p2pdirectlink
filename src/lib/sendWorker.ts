//thanks to https://codesandbox.io/s/web-worker-reactjs-2sswe

const worker = async () => {
	const chunkSize = 200000
	onmessage = async function (e) {

		const file = e.data
		const fileSize = file.size

		console.log(file)

		this.postMessage({ name: file.name, type: file.type })

		for (let start = 0; start < fileSize; start += chunkSize) {
			if (chunkSize > fileSize - start) {
				console.log("smallerchunk")
				const final = start + (fileSize - start)
				const buffer = await file.slice(start, final).arrayBuffer()
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore: Unreachable code error
				this.postMessage(buffer, [buffer])
			} else {
				console.count("chunk: ")
				const buffer: ArrayBuffer = await file.slice(start, start + chunkSize).arrayBuffer()
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore: Unreachable code error
				this.postMessage(buffer, [buffer]) 
				console.log("btlen", buffer.byteLength)
			}
		}
		this.postMessage("d")
	}
}

let code = worker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: "application/javascript" })
const sendWorker = URL.createObjectURL(blob)
console.log(sendWorker)
export default sendWorker