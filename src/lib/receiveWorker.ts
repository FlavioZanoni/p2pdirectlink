//thanks to https://codesandbox.io/s/web-worker-reactjs-2sswe

const worker = async () => {
  onmessage = async function (e) {
    const { data, props } = e.data
    // thanks to https://stackoverflow.com/a/38089419/14314830
    const flattened = Uint8Array.from(data.reduce((a, b) => [...a, ...b], []))

    const propsObj = JSON.parse(props)

    const blob = new Blob([flattened], { type: propsObj.type })
    this.postMessage({ blob: blob, name: propsObj.name })
  }
}

let code = worker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: "application/javascript" })
const sendWorker = URL.createObjectURL(blob)
console.log(sendWorker)
export default sendWorker
