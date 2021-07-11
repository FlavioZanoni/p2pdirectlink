// imports
const io = require("socket.io-client")
let Peer = require("simple-peer")
const socket = io("localhost:8080", { transports: ["websocket"] })

// globals
let peerHost
let peer
let = userServer = {
    "id": "",
    "initiator": "",
    "hash": ""
}
let user = {
    "id": "",
    "data": "",
    "hash": ""
}

// making sure the page doesn't load with the index in the href
if (window.location.href == window.location.origin + "/index.html") {
    window.location.href = window.location.origin
}

// webrtc checker
if (Peer.WEBRTC_SUPPORT) {
    // webrtc support!
    //init the socket
    socket.on("connect", () => {
        console.log('[io]=> connected on the clientside')
        console.log("[io] => socket id = ", socket.id)
        userServer.id = "#" + socket.id
        user.id = "#" + socket.id
        let url = window.location.href + user.id
        if (window.location.hash == '') {
            createId(url) 
        }
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
                document.getElementById("link").appendChild(alert)
            )
            setTimeout(() => {
                document.getElementById("alert").remove()
            },1200)
        })
    }

    // html elements for initiator
    function noHashHTML() {
        // remove/hide elements
        document.querySelector("#loading").remove()
        document.querySelector("#fileDiv").remove()
        document.querySelector("#file-upload").addEventListener("change", () => {
            let file = document.querySelector("#file-upload").files[0]
            let reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = function() {
                let img = document.createElement('img')
                img.src = reader.result
                img.id = "img-preview"
                document.querySelector("#img-prev").appendChild(img)
            }
            reader.onerror = function() {
                console.log(reader.error)
            }
        })
    }

    // html elements for receiver
    function hashHTML() {
        // remove/hide elements
        document.querySelector("#send").remove()
        document.querySelector("#link").remove()
        document.querySelector("#fileDiv").hidden = true
        document.querySelector("#h3-down").hidden = true
    }

    //init the peer depending on the window.location.hash
    // if doesnt have hash it will be the initiator, if has an hash is the receiver
    if (window.location.hash == '') {
        noHashHTML()

        userServer.initiator = true
        userServer.hash = null

        peerHost = new Peer({
            initiator: true,
            //enables ICE
            trickle: false,
        })
        peerHost.on('signal', function (data) {

            user.data = data

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
        hashHTML()

        userServer.initiator = false
        userServer.hash = window.location.hash

        user.hash = window.location.hash
        peer = new Peer({
            initiator: false,
            //enables ICE
            trickle: false,
        })
        emitUser()
    }

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
        socket.emit("user", userServer)
    }

    // id matches database
    socket.on('accepted', () => {
        console.log("id maches database")
    })

    // send host data to the server then from the server to the receiver
    socket.on("needData", (id) => {
        socket.emit("hostData", id, user)
    })


    // peer receiver receiving data
    socket.on('hostData', (host) => { 
        console.log("Here is the host data: ", host.data)
        peer.signal(host.data)
        peer.on('signal', function (data) {
            user.data = data
            console.log(user.data)

            // emits the receiver data and the host id
            let id = host.id.slice(1, host.id.length)
            console.log("user :", user, id)
            socket.emit('receiverData', id, user.data)

            peer.on('connect', () => { 
                console.log("[peerReceiver] = Connected with peer host")
                // terminates the socket
                socket.disconnect(
                    console.log("socket terminated")
                )
            })
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

    // host receives the user data to connect
    socket.on('receiverConnect', (user) => {
        console.log("oiee teste de recebimento do peer receiver")
        console.log("user receiver data: ", user)
        peerHost.signal(user)
        peerHost.on('connect', () => {
            console.log("[peerHost] = Connected with peer receiver") 
            // terminates the socket
            socket.disconnect(
                console.log("socket terminated")
            )
        })
    })

    
    // id doesn't mach database
    socket.on('notFound', () => {
        // setup the html for invalid link
        document.querySelector("#loading").remove()
        document.querySelector("#footer").remove()

        let head = document.createElement('h1')
        head.innerText = "This link is invalid"
        head.id = "invalid"

        let paragraph = document.createElement('p')
        paragraph.innerHTML = "this may be caused by:"

        let list = document.createElement('ul')

        let l1 = document.createElement('li')
        l1.innerText = "Wrong link"
        list.appendChild(l1)

        let l2 = document.createElement('li')
        l2.innerText = "Host user has disconnected"
        list.appendChild(l2)

        let l3 = document.createElement('li')
        l3.innerText = "Server error"
        list.appendChild(l3)

        
        let btn =  document.createElement("a")
        btn.href = window.location.origin
        btn.className = "btn"
        btn.innerText = "Main page"
        
        let file = document.querySelector("#file")
        file.appendChild(head)
        file.appendChild(paragraph)
        file.appendChild(list)
        file.appendChild(btn)


        // terminates the peer
        peer.destroy(
            console.log("peer terminated")
        )
        // terminates the socket
        socket.disconnect(
            console.log("socket terminated")
        )

        throw console.error("This link is invalid")
    })

    // send message on user disconnect
    socket.on("disconnect")

} else {
    window.location = window.location.origin + "/src/unsuported.html"
}