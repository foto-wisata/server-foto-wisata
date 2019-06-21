const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {comparePassword, generateJWT} = require('../Helpers/crypt')

class UserController{
    static create(req, res, next){
        User.findOne({
                username : req.body.username
            })
        .then(found => {
            if(!found){
                let {username, password, email} = req.body
                let obj = new User({username, password, email})
                console.log('halo?')
                return obj.save()
            }else{
                throw 'userusername already taken'
            }
        })
        // console.log('apakah disini?')
        .then(created => {
            console.log('ke save?')
            res.status(200).json(created)
        })
        .catch(next)
    }
    static login(req, res, next){
        console.log('pasti masuk')
        User.findOne({email : req.body.email}).exec()
        .then(found => {
            console.log('ketemu 1')
            if(found){
                let success = comparePassword(req.body.password, found.password)
                if(success){
                    let payload = {
                        username : found.username,
                        email : found.email,
                        id : found._id
                    }
                    let token = generateJWT(payload)
                    res.status(200).json({token, payload})
                }
            }else{
                console.log('else luar')
                throw {msg : 'salah uiy'}
            }
        })
        .catch(next)
    }
    static googleSignIn(req, res, next){
        console.log('masuk')
        const client = new OAuth2Client(process.env.Google_id)
        client.verifyIdToken({
            idToken : req.body.idToken
        })
        .then(ticket => {
            console.log(ticket, 'dapet ticket')
            const payload = ticket.getPayload()
            User.findOne({
                email : payload.email
            })
            .then(function(found){
                console.log(found, 'nemu found')
                if(found){
                    let token = jwt.sign({
                        email : found.email,
                        _id : found._id
                    }, process.env.JWT_SECRET)
                    res.json({
                        token
                    })
                }else{
                    console.log('bikin signup')
                    req.body.email = payload.email
                    req.body.password = 'qwertyu'
                    console.log(req.body)
                    UserController.signup(req, res, next)
                }
            })
            console.log(payload)
        })
        .catch(next)
    }
}

module.exports = UserController