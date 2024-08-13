require('dotenv/config')
const express = require('express');
const server = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {verify, sign} = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {userCredential} = require('../database/connectionModels')
server.use(cookieParser())
const tokenSecrete = process.env.TOKENSCERETE


server.get('/login', async function(req, res){
    try {
        const userAgentHeaders = req.headers
        const cookiesHeaders = userAgentHeaders.cookies
        verify(cookiesHeaders, tokenSecrete)
        res.status(200).send()
    } catch (error) {
        // console.log({error:error})
        res.status(400).send()
    }
})

server.post('/login', async function(req, res){
    try {
        const {username, password} = req.body
        const findUsername = await userCredential.findOne({username:username })
        const findPassword = findUsername.password
        if(findUsername){
           const userVerification =  await bcrypt.compare(password, findPassword)
           if (userVerification){
            const userSignature ={
                username:findUsername.username,
                password:findPassword
            }
            const userSignatureToken = sign(userSignature, tokenSecrete,{
                expiresIn:'5m'
            })
            const signedCredentials ={cookies:userSignatureToken}
            // console.log(signedCredentials)
            res.status(200).send(signedCredentials)
           }
        }
    } catch (e) {
        // console.log({error:e})
        res.status(400).send(400)
    }
})


module.exports={
    loginGet:server,
    loginPost:server
}
