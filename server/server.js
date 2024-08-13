/*
THIS IS THE MAIN ROUTE THAT HOUSES ALL THE ROUTES FOR EASY ACCESSIBILITY AND 
DATA POSTING OR DATA REQUESTS.
 */
require('dotenv/config');
const { log} = require('console');
const express = require('express');
const server = express();
const cors = require('cors');

const port = process.env.PORT
const baseurl = process.env.baseurl


server.use(express.json())
server.use(cors())

const {createGet} = require('./serverRoutes/createList');
const {createPost} = require('./serverRoutes/createList');
const {dynamicGet, dynamicPost} = require('./serverRoutes/dynamicList');
const {deletePost} = require('./serverRoutes/delete');
const { updatePost} = require('./serverRoutes/updateUnique');
const {analysisGet} = require('./serverRoutes/analysis');
const {createUserPost} = require('./serverRoutes/createUser');
const {loginGet} = require('./serverRoutes/login');
const {uniqueDateFilterPost} = require('./serverRoutes/uniqueListDateFilter')

server.get(baseurl, function (req, res) {
    res.status(200).json('live on home page');
});

server.use(baseurl, createGet)
server.use(baseurl, createPost)
server.use(baseurl, dynamicGet)
server.use(baseurl, dynamicPost)
server.use(baseurl, deletePost)
server.use(baseurl, updatePost)
server.use(baseurl, analysisGet)
server.use(baseurl, createUserPost)
server.use(baseurl, loginGet)
server.use(baseurl, uniqueDateFilterPost)





server.listen(port, function () {
    log(`we are live on port ${port}`)
})
