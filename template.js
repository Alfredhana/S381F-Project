const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
const url = require('url');

const mongourl = '';
const dbName = '';
const client = new MongoClient(mongourl);

client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    /*
        CRUD operations
    */
   client.close();
});