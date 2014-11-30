module.exports = function(socket){
	console.log("A user connected");

	socket.emit('info', {
    msg : "Enjoy the decline"
  });

	socket.on('events:get', function(){
		console.log("Client is requesting list of events");
	})

  socket.on('disconnect', function () {
    console.log("A user dis-connected");
  });
};