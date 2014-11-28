var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/events', function(req, res, next) {
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

router.post('/')

module.exports = router;
