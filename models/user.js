const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
      
    },
    email:{
        type:String,
      
        unique:true
    },

    password:{
        type:String,
      

    },
    googleId:{
        type:String
    }




},{timestamps:true})

userSchema.plugin(findOrCreate);
const user = mongoose.model('user',userSchema)

module.exports = user 