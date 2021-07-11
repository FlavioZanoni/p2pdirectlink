const app = require("express")
const httpServer = require("http").createServer(app)
const options = { /* https://socket.io/docs/v4/server-initialization/#Options */ }
const io = require("socket.io")(httpServer, options)

let exist
let users = []

io.on("connection", socket => {
    console.log('[io]=> User has connected')

    // user entering the website
    socket.on("user", (user) => {
        if (user.initiator == true) {
            //send user id to array
            users.push(user.id)
        }

        if (user.initiator == false) {
            // checks if id exist
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

                // asks data to the host peer
                let id = user.hash.slice(1, user.hash.length)
                socket.to(id).emit("needData", socket.id)

            } else {
                console.log("this id does not exist")
                socket.emit("notFound")
            }
        }
    })

    // receives the host data and pass to the receiver
    socket.on("hostData", (id, user) => {
        socket.to(id).emit("hostData", user)
    })

    // send receiver data to the host
    socket.on("receiverData", (id, user) => {
        socket.to(id).emit("receiverConnect", user)
    })

    // disconnecting user remove id from array
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

httpServer.listen(process.env.PORT || 8080, () => {
    console.log("[nodemon] => tamo on na porta 8080")
});