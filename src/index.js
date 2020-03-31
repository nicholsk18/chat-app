const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const msg = "Welcome"

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', msg)

    // show to everyone but the user comming from
    socket.broadcast.emit("message", "a new user has joined")

    socket.on('sendMsg', (msg) => {
        // sends it to everyone
        io.emit('message', msg)
    })

    // for when user disconects
    socket.on('disconnect', () => {
        io.emit('message', 'a user has left')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})