/*
GET: THIS ROUTE IS USED TO COLLECT LIST OF ALL PEN WE HAVE IN THE DATABASE

POST: THIS ROUTE IS USED TO CREATE A NEW PEN IN THE DATABASE, AND IT WILL BE A BRANCH
1. WE USE THE REQ.BODY {NAME} TO FIND IN THE DATABASE IF WE ALREADY HAVE SUCH NAME
2. IF THE NAME IS NOT FOUND, WE CREAT A NEW PEN. BUT IF FOUND, WE SEND AN ERROR 400 BACK
*/



const express = require('express');
const server = express();
const mongoose = require('mongoose');
const totalistDBurl = 'mongodb://127.0.0.1:27017/titleList'
const { TitleListPlus, TitleList } = require('../database/connectionModels')

server.use(express.json())


mongoose.createConnection(totalistDBurl)
server.get('/create', async function (req, res) {
    const findAllPens = await TitleList.find({})
    const sortByDesendingOrder = findAllPens.reverse()
    res.json(sortByDesendingOrder)
})

const createList = async function () {
    server.post('/create', async function (req, res) {
        // console.log(req.body)
        try {
            const { name } = req.body
            const formatName = name.replace(/\s/g, '')
            const checkIfExisting =await TitleList.findOne({ title: formatName })
            const checkIfExistingArray =await TitleList.findOne({ title: formatName })
            if (checkIfExisting && checkIfExistingArray) {
                res.status(400).send()
            } else if (!checkIfExisting && !checkIfExistingArray) {
                const replace = name.replace(/\s/g, '')
                await TitleList.create({ title: replace })
                await TitleList.save

                await TitleListPlus.create({ title: replace })
                await TitleListPlus.save

                res.status(200).send()
            }


        } catch (e) {
            console.log({ error: e })
        }
    })
}
createList()


module.exports = {
    createGet: server,
    createPost: server
}



