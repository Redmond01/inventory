const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const userCredentials = mongoose.model('userCredentials', userSchema)
module.exports={userSchema}