const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
	if (req.session.authenticated) {
		res.redirect('/users/dashboard');
	}
	else{
		res.render('welcome');
	}
})

module.exports = router;
