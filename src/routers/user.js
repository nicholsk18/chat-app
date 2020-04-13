const express = require('express')
// const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users',  async (req, res) => {
    console.log(req.body)
    
    res.redirect('chat.html')
})

module.exports = router