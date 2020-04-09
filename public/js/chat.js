const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:m a")
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)

    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        locationMessage: "My current location",
        createdAt: moment(message.createdAt).format("h:m a")
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // disable button after send is clicked
    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value

    socket.emit('sendMsg', msg, (error) => {
        // enable button after message was sent
        $messageFormButton.removeAttribute('disabled')

        // clear input
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    // disable send location after click
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            // enable after location was send
            $sendLocationButton.removeAttribute('disabled')

            console.log("Location shared")
        })
    })
})

// send chatroom to the server
socket.emit('join', { username, room }, (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
})