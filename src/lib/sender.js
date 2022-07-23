import convertToDataUrl from "./convertDataUrl";
const chunkSize = 200000

export const sender = async (peer, file) => {
    let fileUrl = await convertToDataUrl(file)
    console.log(fileUrl)
    let fileSize = fileUrl.length

    if (fileSize < chunkSize) {
        peer.write(fileUrl)
    } else {
        await slice(peer, fileUrl)
    }
}

const slice = async (peer, file) => {
    let fileSize = file.length
    let c = 0
    for (let start = 0; start < fileSize; start += chunkSize) {
        c++
        if (chunkSize > fileSize - start) {
            console.log("smallerchunk")
            let final = start + (fileSize - start)
            //peer.write(c.toString())
            peer.write(file.slice(start, final))
            peer.write("d")
        } else {
            console.count('chunk: ')
            //peer.write(c.toString())
            peer.write(file.slice(start, start + chunkSize))
        }
    }
}