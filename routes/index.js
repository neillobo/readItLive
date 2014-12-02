
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/main',
		failureRedirect: '/',
		failureFlash : true
	}));

	//Admin Page
	router.get('/admin', function(req, res) {
		res.render('admin', { message: req.flash('message') });
	});

	router.post('/admin', passport.authenticate('admin', {
		sucessRedirect: '/adminHome',
		failureRedirect : 'admin',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/main', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	//Get Events listing
	router.get('/events', function(req, res, next) {
		console.log("Responding to call for events");
		Event.find(function(err, events){
				  	if(err){ return next(err); }
				  	res.json(events);
				  });
	});

	//Create a new Listing
	router.post('/events', function(req, res, next){
		var event = new Event(req.body);
			event.save(function(err, event){
				if(err) {return next(err); }
				res.json(event);
			});
	});
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}
