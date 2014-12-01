var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

module.exports = function(socket){
	console.log("A user connected");

	socket.on('events:get', function(){
		console.log("Client is requesting list of events");
		Event.find(function(err, events){
  	if(err){ socket.emit('error',err); }
  		socket.emit('events:list',events);
  	});
	});

	socket.on('events:add', function(newEvent){
		console.log("POST REQUEST for creating new events");
		var event = new Event(newEvent);
		event.save(function(err, event){
		if(err) {socket.emit('error',err); }
		});
	});

	socket.on('posts:get', function(eventId){
		console.log("Client is requesting list of posts for eventId",eventId.id)
		var ObjectId = require('mongoose').Types.ObjectId;
		var eventId = new ObjectId(eventId.id);

		Event.findById(eventId, function(err, event){
			if(err){ socket.emit('error',err); }
			event.populate('posts', function(err, event){
				console.log("Event found and populated");
				socket.emit('posts:list', event);
			});
	  });

	});

	socket.on('posts:add', function(newPost){

	});

  socket.on('disconnect', function () {
    console.log("A user dis-connected");
  });
};