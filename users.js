const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require("bcryptjs");
var app = express()

const { render } = require('ejs');
const router = express.Router();

const assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
const mongourl = 'mongodb+srv://alfredljm:8484037409a@cluster0.eshyv.mongodb.net/test?retryWrites=true&w=majority';  // MongoDB Atlas Connection URL
const client = new MongoClient(mongourl);
const dbName = 'test';
let User;

client.connect((err) => {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	User = db.collection('users');
});

const handle_Login = (req, res) => {
	const {name, password} = req.body;
	const errors = [];
	User.findOne({name: name},function(err, user) {
		console.log('user name: '+user.name);
		if (!user){
			errors.push({msg: 'Name dont exist'});
			res.render('login', {
				errors: errors,
				name: name,
				password: password
			})
		}else{
			const isMatch = bcrypt.compare(password, user.password);
			if (!isMatch){
				errors.push({msg: 'Password not match'});
				res.render('login', {
					errors: errors,
					name: name,
					password: password
				})
			}
			else{
				req.session.authenticated = true;
				req.session.user = name;
				console.log('Session user name: '+req.session.user);
				res.redirect('dashboard');
			}
		}
	});
}

const handle_Register = (req, res) => {
    const {name, password, password2} = req.body;
	const errors = [];
	if (!name){
		 errors.push({msg: "Please fill in the blanks: name"});
	}
	if (password != password2){
		 errors.push({msg: "Password dont match"});
	}
	if (errors.length>0){
		res.render('register', {
			errors: errors,
			name: name,
			password: password,
			password2: password
		})
	}else{
		User.findOne({name: name},function(err, user) {
			console.log('err: '+err);
			if (user){
				errors.push({msg: 'Name already registerd'});
				res.render('register', {
					errors: errors,
					name: name,
					password: password,
					password2: password2
				})
			}else{
				const newUser = {};
				newUser['name'] = name;
				newUser['password'] = password;
				req.flash('success_msg', 'You have successfully registered!');
				User.insertOne(newUser,(err,results) => {
					console.log('Inserted: '+results.result.nModified+" users");
				});
				res.redirect('login');
			}

		})
	}
}

router.get('/register', (req,res)=>{
	res.render('register');
})

router.get('/login', (req,res)=>{
	res.render('login');
})

router.get('/logout', (req,res)=>{
	req.session = null;
	res.render('logout', {
		success_msg: 'You have logout!'
	})
})

router.get('/dashboard', (req, res)=>{
	res.render('dashboard',{
		user: req.session.user
	});
})

router.post('/login',(req,res,next)=>{
    handle_Login(req, res);
})

router.post('/register', (req, res)=>{
    handle_Register(req, res);
})

module.exports = router;
