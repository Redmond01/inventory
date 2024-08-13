require('dotenv/config');
const mongoose = require('mongoose');
const titleListDBurl = process.env.TITLELISTDBURL;
const titleListPlusDBurl =process.env.TITILELISTPLUSDBURL;
const userCredntialsDb = process.env.USERLOGINDBURL;
const {titles} = require ('./titleList');
const {titlePlus} = require('./titleListPlus');
const {userSchema} = require('./userCredentials');



const connection = mongoose.createConnection(titleListDBurl);
const TitleList = connection.model('TitleList', titles);

const connections = mongoose.createConnection(titleListPlusDBurl);
const TitleListPlus= connections.model('TitleListPlus', titlePlus);

const connectionUsers = mongoose.createConnection(userCredntialsDb);
const userCredential = connectionUsers.model('userCredentials', userSchema);


module.exports= {TitleList,TitleListPlus, connections, connection, userCredential,connectionUsers};

