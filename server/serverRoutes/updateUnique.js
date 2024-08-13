/*
THIS ROUTE IS WHERE WE UPDATE EACH DATA IN THE LIST SCHEMA DYNAMICALLY,
1. WE FIND THE UNIQUE PEN
2. WE FIND THE EXACT ID
3. WE UPDATE THE ID WITH THE REQ.BODY
*/

const express = require('express');
const server = express()
const { TitleListPlus } = require('../database/connectionModels')


server.post('/api/update/:id', async function (req, res) {
    try {
        const { title, _id, noOfEgg, noOfFeed, motals, date, month, year } = req.body
        const findOneId = await TitleListPlus.findOneAndUpdate(
            { title: title, 'listing._id': _id },
            { $set: { 'listing.$.noOfEgg': noOfEgg, 'listing.$.noOfFeed': noOfFeed, 'listing.$.motals': motals, 'listing.$.date': date, 'listing.$.month': month, 'listing.$.year': year } },
            { new: true })
        await findOneId.save()
        res.status(200).send()

    } catch (error) {
        res.status(400).send()
        console.log({ error: error.message })
    }
})




module.exports = { updatePost: server }