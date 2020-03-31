const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

let send = document.querySelector('#message-form')

send.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.message.value
    socket.emit('sendMsg', msg)
})