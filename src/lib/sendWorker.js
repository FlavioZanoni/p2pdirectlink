//thanks to https://codesandbox.io/s/web-worker-reactjs-2sswe

const worker = async () => {
    const chunkSize = 200000
    onmessage = async function (e) {
        const { file } = e.data
        let fileSize = file.size

        if (fileSize < chunkSize) {
            this.postMessage(file)
            this.postMessage("d")
        } else {
            await slice()
        }

        const slice = async () => {
            for (let start = 0; start < fileSize; start += chunkSize) {
                if (chunkSize > fileSize - start) {
                    console.log("smallerchunk")
                    let final = start + (fileSize - start)
                    this.postMessage(file.slice(start, final))
                } else {
                    console.count('chunk: ')
                    this.postMessage(JSON.stringify(file.slice(start, start + chunkSize)))
                }
            }
            this.postMessage("d")
        }
    };
};

let code = worker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], { type: "application/javascript" });
const sendWorker = URL.createObjectURL(blob);
console.log(sendWorker)
export default sendWorker;