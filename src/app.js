const io = require("socket.io-client")
var Peer = require("simple-peer")
const socket = io("localhost:8080", { transports: ["websocket"] })

let peerHost
let peer
let user = {
    "id": "",
    "data": "",
    "initiator": "",
    "hash": ""
}

//init the socket
socket.on("connect", () => {
    console.log('[io]=> connected on the clientside')
    console.log("[io] => socket id = ", socket.id)
    user.id = "#" + socket.id
    let url = window.location.href + user.id
    createId(url) 
})

function createId(url) {
    // create element to hold the link
    let txt = document.createElement("a")
    txt.id = "txtLink"
    txt.innerText = url
    document.getElementById("link").appendChild(txt)

    // copied message
    let alert = document.createElement("span")
    alert.id = "alert"
    alert.innerText = "copied to clipboard"
    // copy
    txt.addEventListener('click', () => {
        navigator.clipboard.writeText(url).then(
            document.getElementById("link").appendChild(alert).then(
                setTimeout(() => {
                    document.getElementById("alert").remove()
                },1200)
            )
        )
    })
}

//init the peer depending on the window.location.hash
// if doesnt have hash it will be the initiator, if has an hash is the receiver
if (window.location.hash == '') {
    // remove/hide elements
    document.querySelector("#loading").remove()
    document.querySelector("#fileDiv").remove()

    user.initiator = true
    user.hash = null
    peerHost = new Peer({
        initiator: true,
        //enables ICE
        trickle: false,
    })
    peerHost.on('signal', function (data) {
        //document.getElementById("yourId").value = JSON.stringify(data)
        user.data = data
        //document.getElementById("link").innerHTML = "oie"
        emitUser()
        document.querySelector("#submit").addEventListener('click', ()=> {
            // gets file
            let file = document.querySelector("#file-upload").files[0]
            let reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = function() {
                console.log(reader.result)
                peerHost.send(reader.result)
            }
            reader.onerror = function() {
                console.log(reader.error)
            }
            console.log(file)  
        })
    })

} else {
    // remove/hide elements
    document.querySelector("#send").remove()
    document.querySelector("#link").remove()
    document.querySelector("#fileDiv").hidden = true
    document.querySelector("#h3-down").hidden = true

    user.initiator = false
    user.hash = window.location.hash
    peer = new Peer({
        initiator: false,
        //enables ICE
        trickle: false,
    })
    emitUser()
}

// peer receiver receiving data
socket.on('hostData', (host) => { 
    console.log("Here is the host data: ", host.data)
    peer.signal(host.data)
    peer.on('signal', function (data) {
        //document.getElementById("yourId").value = JSON.stringify(data)
        user.data = data
        console.log(user.data)
        peer.on('connect', () => { console.log("[peerReceiver] = Connected with peer host") })
        // emits the receiver data and the host id
        let id = host.id.slice(1, host.id.length)
        console.log("user :", user, id)
        socket.emit('receiverData', user.data, id)
    })
    peer.on('data', data => {
        // convert it to an blob
        let blob = new TextDecoder("utf-8").decode(data)
        console.log(blob)

        blobToFile(blob, "upload")

        // convert it to dataURL
        function blobToFile(theBlob, fileName){
            //A Blob() is almost a File() - it's just missing the two properties below which we will add
            theBlob.lastModifiedDate = new Date()
            theBlob.name = fileName

            createHTML(theBlob)
            // input file in the html

        }
    })
})

function createHTML(theBlob) {
    document.querySelector("#h3-down").hidden = false
    document.querySelector("#loading").remove()
    // image
    let img = document.createElement('img')
    img.src = theBlob
    img.id = "img-down"
    document.querySelector("#file").appendChild(img)

    // download button
    let button = document.createElement("a")
    button.className = "btn"
    button.innerHTML = "Download";
    button.href= theBlob
    button.download = "peerFile"
    document.querySelector("#file").appendChild(button)
}

// emits the user object to the server
function emitUser() {
    console.log("user emited")
    socket.emit("user", user)
}

// host receives the user data to connect
socket.on('receiverConnect', (user) => {
    console.log("oiee teste de recebimento do peer receiver")
    console.log("user receiver data: ", user)
    peerHost.signal(user)
    peerHost.on('connect', () => { console.log("[peerHost] = Connected with peer receiver") })
})

// id matches database
socket.on('accepted', () => {
    console.log("id maches database")
})

// id doesn't mach database
socket.on('notFound', () => {
    throw console.error("This link is invalid")
    // append alert saing that the link is wrong
})

socket.on("disconnect")





