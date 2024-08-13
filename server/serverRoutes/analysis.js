/*
THIS FILE IS WHAT WILL LOOK FOR ALL THE DATA THAT IS ATTACHED TO THE PARAMS, AND
SEND TO THE CLIENT. IN THIS CASE THE CLIENT/ANAYLSIS ROUTE.

*/


const express = require('express');
const server = express();
const {TitleListPlus} = require('../database/connectionModels')

const analysis = function(){
    server.get('/analysis/:id', async function(req, res){
        const {id} = req.params
        const findById = await TitleListPlus.findOne({title:id})
        console.log(findById)
        res.json(200)
    })
    server.post('/analysis/:id', async function(req, res){
        const {_id} = req.params
        console.log(req.body)
    })
}

analysis()


module.exports={
    analysisGet:server
}