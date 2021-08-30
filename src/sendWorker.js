onmessage = function(file) {
    console.log("[worker] => Mensagem recebida")

    let chunkSize = 200000

    let reader = new FileReader()
    reader.readAsDataURL(file.data)
    reader.onload = function () {
        let fileSize = reader.result.length

        if (fileSize < chunkSize) {
            postMessage(reader.result)
            postMessage("d")

        } else {

            let looper = async function () {
                for (let start = 0; start < fileSize; start += chunkSize) {
                  await new Promise(function (resolve, reject) {
                    setTimeout(function () {

                        let result = reader.result
                        let chunk
                        // checks the if the chunk gonna be full size or not
                        if (chunkSize > fileSize - start) {
                            console.log("smallerchunk")
                            let final = start + (fileSize - start)
    
                            chunk = result.slice(start, final)
                            postMessage(chunk)
    
                            console.count("enviado")

                            // when finishes sending the pieces, send a "d" of done
                            postMessage("d")
                        } else {
                            chunk = result.slice(start, start + chunkSize)
                            postMessage(chunk)
                            console.count("enviado2")
                        }
                        resolve(true);

                    }, 110);
                  });
                }
                return true;
              }
              looper()
        }
    }
}




