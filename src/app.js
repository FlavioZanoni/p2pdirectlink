// imports
const io = require("socket.io-client")
const Peer = require("simple-peer")
const socket = io("https://sleepy-hamlet-10685.herokuapp.com/", { transports: ["websocket"] })

// globals
let peerHost
let peer
let url
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

//workersT
const sendWorker = new Worker('/src/sendWorker.js')
const reciveWorker = new Worker('/src/reciveWorker.js')

// making sure the page doesn't load with the index in the href
if (window.location.href == window.location.origin + "/index.html") {
    window.location.href = window.location.origin
}

// webrtc checker
if (Peer.WEBRTC_SUPPORT) {
    // webrtc support!
    let hash
    if (window.location.hash == '') {
        hash = false
        noHashHTML()
        loadingLink()

    } else {
        hash = true
        hashHTML()
    }

    // html elements for initiator
    function noHashHTML() {
        // remove/hide elements
        document.getElementById("loading").remove()
        document.getElementById("fileDiv").remove()
        document.getElementById("file-upload").addEventListener("change", () => {
            let file = document.getElementById("file-upload").files[0]
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                let img = document.createElement('img')
                img.src = reader.result
                img.id = "img-preview"
                document.getElementById("img-prev").appendChild(img)
            }
            reader.onerror = function () {
                console.log(reader.error)
            }
        })
    }

    // loading alert
    function loadingLink() {
        let loading = document.getElementById("link")
        let para = document.createElement("p")
        para.id = "loading-p"
        para.innerHTML = "Loading"
        loading.appendChild(para)
        let img = document.createElement("img")
        img.id = "loading-img"
        img.src = "./images/loading.gif"
        loading.appendChild(img)
    }

    // html elements for receiver
    function hashHTML() {
        // remove/hide elements
        document.getElementById("send").remove()
        document.getElementById("link").remove()
        document.getElementById("fileDiv").hidden = true
        document.getElementById("h3-down").hidden = true
    }

    //init the socket
    socket.on("connect", () => {
        console.log('[io]=> connected on the serverside')
        console.log("[io] => socket id = ", socket.id)
        userServer.id = "#" + socket.id
        user.id = "#" + socket.id
        url = window.location.href + user.id
        runAll()
    })

    // runs only when the socket is initiated
    function runAll() {
        //init the peer depending on the window.location.hash
        // if doesnt have hash it will be the initiator, if has an hash is the receiver
        if (hash == false) {
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
                document.getElementById("submit").addEventListener('click', () => {
                    let file = document.getElementById("file-upload").files[0]
                    sendWorker.postMessage(file)
                })

                sendWorker.onmessage = function(chunk) {
                    peerHost.send(chunk.data)
                }
            })

        } else {
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

        function createHTML(link) {

            document.getElementById("h3-down").hidden = false
            document.getElementById("loading").remove()
            // image
            let img = document.createElement('img')
            img.src = link
            img.id = "img-down"
            document.getElementById("file").appendChild(img)

            // download button
            let button = document.createElement("a")
            button.className = "btn"
            button.innerHTML = "Download";
            button.href = link
            button.download = "peerFile"
            document.getElementById("file").appendChild(button)
        }

        // emits the user object to the server
        function emitUser() {
            console.log("user emited")
            socket.emit("user", userServer)
            if (window.location.hash == '') {
                createId(url)
            }
        }

        function createId(url) {
            // create element to hold the link
            let txt = document.createElement("a")
            txt.id = "txtLink"
            txt.innerText = url
            document.getElementById("link").appendChild(txt)

            // removes the loading paragraph and image
            document.getElementById("loading-p").remove()
            document.getElementById("loading-img").remove()

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
                }, 1200)
            })
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
            //console.log("Here is the host data: ", host.data)
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

            let uintArr = []
            peer.on('data', data => {
                if (data.length == 1 && data[0] == 100) {
                    console.log("file is done")
                    reciveWorker.postMessage(uintArr)
                } else {
                    uintArr.push(data)
                }

                // concat and convert it to dataURL
                reciveWorker.onmessage = function (msg) {
                    createHTML(msg.data)
                }
            })
        })

        // host receives the user data to connect
        socket.on('receiverConnect', (user) => {
            console.log("user receiver data: ", user)
            peerHost.signal(user)
            peerHost.on('connect', () => {
                console.log("[peerHost] = Connected with peer receiver")
                window.alert("receiver connected")
                // terminates the socket
                socket.disconnect(
                    console.log("socket terminated")
                )
            })
        })

        // id doesn't mach database
        socket.on('notFound', () => {
            // setup the html for invalid link
            document.getElementById("loading").remove()
            document.getElementById("footer").remove()

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


            let btn = document.createElement("a")
            btn.href = window.location.origin
            btn.className = "btn"
            btn.innerText = "Main page"

            let file = document.getElementById("file")
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
    }

} else {
    window.location = window.location.origin + "/src/unsuported.html"
}