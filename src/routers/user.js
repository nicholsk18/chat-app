const express = require('express')
// const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users',  async (req, res) => {
    console.log(req.body)
    
    res.redirect(`chat.html?username=${req.body.username}&room=${req.body.room}`)
})

module.exports = router