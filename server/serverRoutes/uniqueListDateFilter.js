/*
THIS ROUTE IS WHERE WE MAKE SOME QUERY FILTER TO OUR DATABASE
1. WE WILL TAKE THE REQ.PARAMS TO FILTER THE DATABASE PEN LIST
2. WE WILL TAKE A LOOK AT WAHT IS COMING FROM THE REQ.BODY, AND WE MAKE A QUERY 
FILER TO OUR DATABASE, AND SEND BASCK TO THE CLIENT AS THER RESPONSE
*/
const express = require('express');
const server = express();
const {TitleListPlus} = require('../database/connectionModels')



server.use(express.json())
server.post('/uniqueFilter/:id', async function(req, res){
    const {id} = req.params
    const {month, year} = req.body
    // console.log(req.body, req.params.id)
    const filterById = await TitleListPlus.findOne({title:id})
    const filterByMonthAndYear = filterById.listing.filter(function(details){
        return details.month === month && details.year === year
    })
    res.status(200).send(filterByMonthAndYear)
})


module.exports={
    uniqueDateFilterPost:server
}