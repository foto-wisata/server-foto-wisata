const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        User.findOne({username : req.body.username})
        .then(found => {
            console.log('ketemu 1')
            if(found){
                bcrypt.compare(req.body.password, found.password, function(err, sucess) {
                    if(sucess){
                        console.log('bro')
                        let payload = {
                            username : found.username,
                            email : found.email,
                            id : found.id
                        }
                        let token = jwt.sign(payload, process.env.JWT_SECRET)
                        res.json({token})
                    }else{
                        console.log('eo')
                        throw ({status : 401, msg : 'wrong inputs'})
                    }
                })
            }else{
                console.log('else luar')
                throw {msg : 'salah uiy'}
            }
        })
        .catch(next)
    }
}

module.exports = UserController