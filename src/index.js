const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', generateMessage('Welcome'))

    // show to everyone but the user comming from
    socket.broadcast.emit("message", generateMessage('a new user has joined'))

    socket.on('sendMsg', (msg, callback) => {
        const filter = new Filter()
        
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }

        // sends it to everyone
        io.emit('message', generateMessage(msg))
        callback()
    })

    // sends location to users
    socket.on('sendLocation', (cords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })

    // for when user disconects send to all
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('a user has left'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})