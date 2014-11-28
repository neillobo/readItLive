var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');
/* GET home page. */
router.get('/', function(req, res) {
	console.log("Route handling for /");
  res.render('index', { title: 'Express' });
});

router.get('/events', function(req, res, next) {
	console.log("Route handling for /events");
  Event.find(function(err, events){
  	if(err){ return next(err); }

  	res.json(events);
  })
});

router.post('/events', function(req, res, next){
	var event = new Event(req.body);

	event.save(function(err, event){
		if(err) {return next(err); }

		res.json(event);
	});
});





router.get('/events/:id', function(req, res, next){

	console.log("Route handling for /events/:id", req.params.id);

		var ObjectId = require('mongoose').Types.ObjectId;
		var eventId = new ObjectId(req.params.id);

		console.log("The eventId is ", eventId);

	Event.findById(eventId, function(err, event){
		if(err){ return next(err); }
		res.json(event);
	});

});

module.exports = router;
