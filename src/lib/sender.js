import convertToDataUrl from "./convertDataUrl";
const chunkSize = 200000

export const sender = async (peer, file) => {
    let fileUrl = await convertToDataUrl(file)
    let fileSize = fileUrl.length

    if (fileSize < chunkSize) {
        console.log('writing')
        peer.write(fileUrl)
        peer.write("d")
    } else {
        await slice(peer, fileUrl)
    }
}

const slice = async (peer, file) => {
    console.log('ta aquis')
    let fileSize = file.length
    for (let start = 0; start < fileSize; start += chunkSize) {
        if (chunkSize > fileSize - start) {
            console.log("smallerchunk")
            let final = start + (fileSize - start)
            //peer.write(c.toString())
            peer.write(file.slice(start, final))
        } else {
            console.count('chunk: ')
            peer.write(file.slice(start, start + chunkSize))
        }
    }
    peer.write("d")
}