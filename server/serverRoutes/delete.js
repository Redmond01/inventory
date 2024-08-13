/**
 POST: THIS ROUTE IS USED TO DELET A PEN DATA, HOWEVER WE WILL ERASE ALL THE DATA,
 AND WE WLL NOT HAVE ACCESS TO THEM AGAIN
 */

const  mongoose = require('mongoose');
const express = require('express');
const server = express();
const {TitleList, TitleListPlus, connection, connections} = require('../database/connectionModels')

server.post('/api/del/:id',async function(req, res){

    const {name, id} = req.body
    try {
        const finduniqueOne = await TitleList.findOneAndDelete({title:name, _id:id})
        if(!finduniqueOne){
            res.status(400).send()
        }else{
            res.status(200).send()
        }
        const findUniqueOneList = await TitleListPlus.findOneAndDelete({title:name,})
        if(!findUniqueOneList){
            res.status(400).send()
        }else{
            res.status(200).send()
        }
        
    } catch (e) {
        console.log({error:e})
    }
})



module.exports= {deletePost:server}