const socket = io()

// variables
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

socket.on('message', (msg) => {
    console.log(msg)
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