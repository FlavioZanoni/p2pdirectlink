const app = require("express")
const httpServer = require("http").createServer(app)
const options = { /* https://socket.io/docs/v4/server-initialization/#Options */ }
const io = require("socket.io")(httpServer, options)

let exist
// cant have this, final project must be an database
let users = []

io.on("connection", socket => {
    console.log('[io]=> User has connected')

    // user entering the website
    socket.on("user", (user) => {
        //console.log(user)

        if (user.initiator == true) {
            //send user to database
            users.push(user)
        }

        if (user.initiator == false) {
            //console.log(user)
            let elemento
            users.forEach(element => {
                if (user.hash == element.id) {
                    exist = true
                    elemento = element
                } else {
                    exist = false
                }
            })
            if (exist == true) {
                console.log("it exists")
                socket.emit("accepted")
                socket.emit('hostData', elemento)
                //sendToHost(user)
            } else {
                console.log("this id does not exist")
                socket.emit("notFound")
            }
        }
    })

    socket.on('receiverData', (user, id) => {
        console.log(user)
        io.to(id).emit('receiverConnect', user)
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
