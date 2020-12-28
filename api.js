const ObjectId = require('mongodb').ObjectID;

const express = require('express');
var app = express()
app.set('trust proxy', 1) // trust first proxy

var session = require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


const { render } = require('ejs');
const router = express.Router();

let fs = require('fs');
const assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
const mongourl = 'mongodb+srv://alfredljm:8484037409a@cluster0.eshyv.mongodb.net/test?retryWrites=true&w=majority';  // MongoDB Atlas Connection URL
const client = new MongoClient(mongourl);
const dbName = 'test';
let Restaraunt;
const formidable = require('formidable');


client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    Restaraunt = db.collection('restaurant');
});

router.get('/restaurant', (req,res)=>{
	if (!req.session.authenticated) {
    res.redirect('/users/login');
    console.log('Your session is not set!');
  }
  else{
    Restaraunt.find({}).toArray(function(err, results) {
      if (err) throw err;
      res.render('restaurant', {c: results, owner: req.session.user});	
    });
  }
})

router.get('/restaurant/name/:name',function(req,res) {
  let doc = {};
  doc['name'] = req.params.name;
  Restaraunt.find(doc).toArray(function(err, results) {
    if (err) throw err;
    console.log(results);
    res.render('restaurant', {c: results, owner: req.session.user});	
  });
});

router.get('/restaurant/borough/:borough',function(req,res) {
  let doc = {};
  doc['borough'] = req.params.borough;
  Restaraunt.find(doc).toArray(function(err, results) {
    if (err) throw err;
    console.log(results);
    res.render('restaurant', {c: results, owner: req.session.user});	
  });
});

router.get('/restaurant/cuisine/:cuisine',function(req,res) {
  let doc = {};
  doc['cuisine'] = req.params.cuisine;
  Restaraunt.find(doc).toArray(function(err, results) {
    if (err) throw err;
    console.log(results);
    res.render('restaurant', {c: results, owner: req.session.user});	
  });
});

router.get('/create',function(req,res) {
  res.render('new');
});

router.get('/update/:name',function(req,res) {
  let doc = {};
  doc['name'] = req.params.name;
  Restaraunt.find(doc).toArray(function(err, results) {
    if (err) throw err;
    console.log(results);
    res.render('update', {c: results, owner: req.session.user});	
  });
});

router.get('/delete/:name',function(req,res) {
  let doc = {};
  doc['name'] = req.params.name;
  Restaraunt.deleteOne(doc,(err,results) => {
    console.log('Delete: '+results.result.nModified+" documents");
  });
  Restaraunt.find({}).toArray(function(err, results) {
    if (err) throw err;
    res.render('restaurant', {c: results, owner: req.session.user});	
  });
});

router.post('/rate/:name', function(req,res) {
  let updateDoc = {};
  updateDoc['rate'] = req.body.rate;
  let doc = {};
  doc['name'] = req.params.name;
  Restaraunt.updateOne(doc, {$set: updateDoc},(err,results) => {
    console.log('Updated: '+results.result.nModified+" documents");
  });
  Restaraunt.find(doc).toArray(function(err, results) {
    if (err) throw err;
    console.log(results);
    res.render('restaurant', {c: results, owner: req.session.user});	
  });
});

router.post('/create', function(req, res){
  let newDoc = {};
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    
    newDoc['name'] = fields.name;
    newDoc['restaurant_id'] = fields.restaurant_id;
    newDoc['name'] = fields.name;
    newDoc['borough'] = fields.borough;
    newDoc['cuisine'] = fields.cuisine;
    newDoc['photo'] = "";
    newDoc['photo_mimetype'] = "";
    if (files.filetoupload && files.filetoupload.size > 0) {
        fs.readFile(files.filetoupload.path, (err,data) => {
          newDoc['photo'] = new Buffer.from(data).toString('base64');
          newDoc['photo_mimetype'] = fields.photo_mimetype;
          con
          console.log("file created!");
        })
    } else {
      console.log('No file created!');
    }
    newDoc['address'] = fields.address;
    newDoc['grades'] = fields.grades;
    newDoc['owner'] = fields.owner;
    Restaraunt.insertOne(newDoc,(err,results) => {
      console.log('Inserted: '+results.result.nModified+" documents");
    });
  });
  res.redirect('/api/restaurant');
});

router.post('/update/:name', function(req, res){
  let doc = {};
  let updateDoc = {};
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (files.filetoupload && files.filetoupload.size > 0) {
        fs.readFile(files.filetoupload.path, (err,data) => {
          updateDoc['photo'] = new Buffer.from(data).toString('base64');
          updateDoc['photo_mimetype'] = fields.photo_mimetype;
        })
    } else {
      console.log('No file uploaded!');
    }
    doc['name'] = req.params.name;
    updateDoc['borough'] = fields.borough;
    updateDoc['cuisine'] = fields.cuisine;
    updateDoc['address'] = fields.address;
    updateDoc['grades'] = fields.grades;
    Restaraunt.updateOne(doc, {$set: updateDoc},(err,results) => {
    console.log('Updated: '+results.result.nModified+" documents");
  });
  res.redirect('/api/restaurant');
  });
});

module.exports = router;