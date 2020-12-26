const express = require('express');

const router = express.Router();

const url = require('url');
const http = require('http');
const qs = require('querystring');

const app = express();
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


var session = require('cookie-session');
const SECRETKEY = 'I want to pass COMPS381F';
app.use(
	session({
		name: 'loginSession',
		keys: [SECRETKEY]
	})
)

const flash = require('connect-flash');
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', require('./index'));
app.use('/users', require('./users'));
app.use('/api/',require('./api'));

app.listen(8099);
