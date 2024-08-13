require('dotenv/config')
const express = require('express');
const server = express();
const cors = require('cors');
const bcrypt = require('bcrypt')
const {userCredential} = require('../database/connectionModels')
const mongoose = require('mongoose')

server.use(express.json());
server.use(cors());



server.post('/createUser', async function (req, res) {
    const { username, password } = req.body
    try {
        const harshPassword = await bcrypt.hash(password, 15)
        await userCredential.create({
            username: username,
            password: harshPassword
        })
        res.json('saved')

    } catch (error) {
        console.log({ error: error })
    }
})

server.get('/createUser', async function (req, res) {
    res.json('user login')
})

module.exports = {
    createUserPost: server,
    createUserGet: server
}


