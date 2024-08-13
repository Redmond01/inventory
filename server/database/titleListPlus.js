const mongoose = require('mongoose')

const data = mongoose.Schema({
    noOfEgg:{
        type:Number,
        required:true
    },
    noOfFeed:{
        type:Number,
        required:true
    },
    motals:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    }
})

const titlePlus = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    listing:[data]
})

const TitleListPlus = mongoose.model('TitleListPlus', titlePlus)

module.exports={titlePlus}