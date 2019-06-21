var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let resolusiSchema = new Schema({
    description: String,
    image: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users' 
    }
})

let Resolusi = mongoose.model('Resolution', resolusiSchema)
module.exports = Resolusi