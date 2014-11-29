var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	title : String,
	link : String,
	description: String,
	posts : [{type : mongoose.Schema.Types.ObjectId, ref : 'Post'}]
});

mongoose.model('Event', EventSchema);

