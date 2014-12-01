var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

EventRouting = {
	get : function(req, res, next){
 			 		Event.find(function(err, events){
				  	if(err){ return next(err); }
				  	res.json(events);
				  })
     		},
  post : function(req, res, next){
			var event = new Event(req.body);
			event.save(function(err, event){
				if(err) {return next(err); }
				res.json(event);
			});
   }
};

module.exports = EventRouting;