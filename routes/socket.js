var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');
var masterClients = [];

module.exports = function(socket){
	console.log("A user connected");

	// for retrieving all posts of a single event
	socket.on('posts:get', function(eventId){
		var ObjectId = require('mongoose').Types.ObjectId;
		var eventId = new ObjectId(eventId.id);

		Event.findById(eventId, function(err, event){
			if(err){ socket.emit('error',err); }
			event.populate('posts', function(err, event){
				socket.emit('posts:list', event);
			});
	  });

	});

	socket.on('i am master', function(){
		console.log("Master connects");
		masterClients.push(socket.id);
	});

	socket.on('message to master', function(newMessage){
		for(var i=0; i<masterClients.length; i++){
			socket.to(masterClients[i]).emit('slave says', newMessage);
		}

	});

	socket.on('posts:add', function(newPost){

		//broadcast to all clients except the one originating this socket
		socket.broadcast.emit('posts:add', newPost);

		var ObjectId = require('mongoose').Types.ObjectId;
		var eventId = new ObjectId(newPost.id);

		Event.findById(eventId, function(err, event){
			if(err){ socket.emit('error',err); }
				var post  = new Post(newPost.post);
				post.event = newPost.id;

				post.save(function(error, post){
					if(error) {socket.emit('error',err);}

					event.posts.push(post);
					event.save(function (err, event) {
						if(err) {socket.emit('error',err);}

					});

				});
	});
	});

  socket.on('disconnect', function () {
    console.log("A user dis-connected");
  });
};