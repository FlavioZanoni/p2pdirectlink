const io = require("socket.io-client")
var Peer = require("simple-peer")
const socket = io("localhost:8080", { transports: ["websocket"] })

let peer
let hash
let user = {
    "id": "",
    "data": "",
    "initiator": "",
    "hash": ""
}

//init the peer depending on the window.location.hash
if (window.location.hash == '') {
    // if doesnt have hash it will be the initiator, if has an hash is the receiver
    hash = false
    user.initiator = true
    user.hash = null

    peer = new Peer({
        initiator: true,
        //enables ICE
        trickle: true,
    })
    peer.on('signal', function (data) {
        document.getElementById("yourId").value = JSON.stringify(data)
        user.data = data
        //document.getElementById("link").innerText = "your link is :" + window.location.href + id
    })

} else {
    hash = true
    user.initiator = false
    user.hash = window.location.hash

    peer = new Peer({
        initiator: true,
        //enables ICE
        trickle: false,
    })
    peer.on('signal', function (data) {
        document.getElementById("yourId").value = JSON.stringify(data)
        user.data = data
        //document.getElementById("link").innerText = "your link is :" + window.location.href + id
    })
}

//init the socket
socket.on("connect", () => {
    console.log('[io]=> connected on the clientside')
    console.log("[io] => socket id = ", socket.id)
    user.id = "#" + socket.id

    socket.emit("user", user)

    document.getElementById("link").value = window.location.href + user.id
})

// id matches database
socket.on('accepted', () => {
    window.alert('acertou o codigo !!!')
})

// id doesn't mach database
socket.on('notFound', () => {
    throw console.error("This link is invalid")
    // append alert saing that the link is wrong
})

// host receiving data
socket.on('tryHost', (data, receiverId) => {
    console.log("data: ", data)

    //send data to other peer
    socket.emit('receiverSend', user, receiverId)
    // connect peer
    peer.signal(data)
    console.log('host')
    peer.on('connect', () => { console.log("[peer] = oie") })
})

// receiver receiveing
socket.on("tryReceiver", (data) => {
    console.log("receiver data: ", data)
    peer.signal(data)
    peer.on('connect', () => { console.log("[peer] = oie") })
})



socket.on("disconnect")