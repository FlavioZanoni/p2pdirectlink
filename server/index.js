const app = require("express")
const httpServer = require("http").createServer(app)
const options = { /* https://socket.io/docs/v4/server-initialization/#Options */ }
const io = require("socket.io")(httpServer, options)
let exist
// cant have this, final project must be an database
let users = []


function sendToHost(user) {
    console.log("sending connection details to host")
    let data = user.data
    let receiverId = user.id
    console.log("data: ",data)
    //user id with no hash
    let id = user.hash.slice(1, user.id.length)

    io.to(id).emit("tryHost", data, receiverId)
}

function sendToReceiver(user, id) {
    console.log("sending connection details to receiver")
    let data = user.data

    //user id with no hash
    let ids = id.slice(1, id.length)

    io.to(ids).emit("tryReceiver", data)
}

io.on("connection", socket => {
    console.log('[io]=> User has connected')

    // user entering the website
    socket.on("user", (user) => {
        //console.log(user)

        if (user.initiator == true) {
            users.push(user.id)
            console.log(users)
        }

        if (user.initiator == false) {
            //console.log(user)
            
            users.forEach(element => {
                if (user.hash == element) {
                    exist = true
                } else {
                    exist = false
                }
            })
            if (exist == true) {
                console.log("it exists")
                socket.emit("accepted")
                sendToHost(user)
            } else {
                console.log("this id does not exist")
                socket.emit("notFound")
            }
        }
    })

    socket.on("receiverSend", (user, id) => {
        sendToReceiver(user, id)
    })

    // disconnecting user
    socket.on("disconnect", (user) => {
        console.log("[io] => user disconnected")
        id = "#" + socket.id
        users.forEach(element => {
            if (element == id) {
                let index = users.indexOf(user.id)
                users.splice(index, 1)
            }
        })
    })
})

httpServer.listen(8080, () => {
    console.log("[nodemon] => tamo on na porta 8080")
});
