const express = require('express')
const router = express.Router()

//require to child router
const userRouter = require('./userRouter')
const resolution = require('./resolutionRouter')

//authentication
// const {Authentication} = require('../midware/auth')

//router use
router.use('/user', userRouter)
router.use('/resolutions', resolution)

// router.use(Authenticate)

// router.use('/api',Authentication ,testApi)

module.exports = router