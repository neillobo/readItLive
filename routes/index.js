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

  Event.find(function(err, events){
  	if(err){ return next(err); }

  	res.json(events);
  })
});

router.post('/events', function(req, res, next){

	console.log("POST REQUEST for creating new events");
	var event = new Event(req.body);

	event.save(function(err, event){
		if(err) {return next(err); }

		res.json(event);
	});
});

router.get('/events/:id', function(req, res, next){

		var ObjectId = require('mongoose').Types.ObjectId;
		var eventId = new ObjectId(req.params.id);

	Event.findById(eventId, function(err, event){
		if(err){ return next(err); }
		event.populate('posts', function(err, event){
			res.json(event);
		})

	});

});

router.post('/events/:id/post', function(req, res, next){

	console.log("Event Id", req.params.id, "Request body", req.body);

		var ObjectId = require('mongoose').Types.ObjectId;
		var eventId = new ObjectId(req.params.id);

	Event.findById(eventId, function(err, event){
		if(err){ return next(err); }
			var post  = new Post(req.body);
			post.event = req.params.id;

			post.save(function(error, post){
				if(error) {return next(error);}

				console.log("Post saved");
				event.posts.push(post);
				event.save(function (err, event) {
					if(err) {return next(err);}

					res.json(post);
				});

			});
	});

});


module.exports = router;
