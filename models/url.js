const mongoose = require('mongoose');
const user = require('./user')




const urlSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference the User model
    },
    fullurl: {
        type: String,
        required: true
    },
    shorturl: {
        type: String
        
    }
});

const Url = mongoose.model('url',urlSchema)

module.exports = Url;