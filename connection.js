
const assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
const mongourl = 'mongodb+srv://alfredljm:8484037409a@cluster0.eshyv.mongodb.net/test?retryWrites=true&w=majority';  // MongoDB Atlas Connection URL
const client = new MongoClient(mongourl);


module.exports = client;