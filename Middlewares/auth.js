const jwt = require('jsonwebtoken')
const {User , Todo} = require('../models')

module.exports = {
    Authentication(req, res, next){
        let theToken = req.headers.token
        //kalo eroorr disini. kalo tojken gaada, error
        //else
        
        // console.log(token)
        if(!theToken){
            throw ({code : 401 , msg : 'you have to login first'})
        }else{
            try {
                let decode = jwt.verify(theToken, process.env.DB_SECRET)
                req.decode = decode
                next()
            }catch(err) {
                throw ({code : 401 , msg : 'invalid token'})
            }
        }
    },
    
    Authorization(req, res, next){
        Todo.findOne({
            where : {
                id : req.params.id
            }
        })
        .then(foundTodo => {
            if(!foundTodo){
                throw ({code : 404 , msg : 'resource not found'})
            }else{
                if(foundTodo.todosId == req.decode.id){
                    next()
                }else{
                    throw ({code : 401 , msg : 'not authorized'})
                }
            }
        })
        .catch(next)
    }
}