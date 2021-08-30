onmessage = function(msg) {
    let arrays = msg.data

    // sum of individual array lengths
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
    
    if (!arrays.length) return null;
    
    let result = new Uint8Array(totalLength);
    
    // for each array - copy it over result
    // next array is copied right after the previous one
    let length = 0;
    for(let array of arrays) {
        result.set(array, length);
        length += array.length;
    }
    
    let link = new TextDecoder("utf-8").decode(result)
    console.log(link)

    postMessage(link)

}