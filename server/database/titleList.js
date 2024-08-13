const mongoose = require('mongoose')


const titles = mongoose.Schema({
    title:{
        type:String,
        required:true
    }
})
// const TitleList = mongoose.model('TitleList', titles)
// const Models = mongoose.model('Models', titles)

module.exports={titles}
