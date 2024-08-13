/*
GET:
THIS ROUTE IS USED FOR SEARCHING FOR EACH PEN BASED ON THE ID 
THAT IS BEEN SENT WITH THE PARAMS, AND THEN WE SENT THE ALL THE LIST DATA IN THE PEN

POST:
THIS ROUTE IS TO ADD NEW DATA TO A UNIQUE PEN,
BY THIS ROUTE, WE GET THE ID PARAMS, AND WE UPDATE THE 
(LIST) SCHEMA THAT IS ATTACHED TO THE URL PARAMETERS
1. WE FIND THE UNIQUE ID
2. WE ADD NEW DATA TO THE LIST SCHEMA THAT MATCHES THE ID
*/

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const dynamicDbUrl = ('mongodb://127.0.0.1:27017/titleListPlus');
const { TitleListPlus } = require('../database/connectionModels');
// const moment = require('moment')




dynamicListing = async function () {

    await mongoose.connect(dynamicDbUrl)

    server.get('/api/:id', async function (req, res) {
        const { id } = req.params
        const findOneDynamicRoute = await TitleListPlus.findOne({ title: id })
        const reverseListing = findOneDynamicRoute.listing.reverse()
        res.json(reverseListing)
    })

    server.post('/api/:id', async function (req, res) {
        // console.log(req.body)
        try {
            const { id } = req.params
            const refineId = id.replace(/\s/g, '')
            const { egg, feed, motal, date, month, year } = req.body

            const findOne = await TitleListPlus.findOne({ title: refineId })
            const findOneList = findOne.listing
            const updateList = findOneList.push({
                noOfEgg: egg,
                noOfFeed: feed,
                motals: motal,
                date: date,
                month: month,
                year: year
            })
            await findOne.save()
            res.status(200).send()
        } catch (error) {
            console.log({ error: error })
            res.status(400).send()
        }

    })
}

dynamicListing()




module.exports = { dynamicGet: server, dynamicPost: server }

