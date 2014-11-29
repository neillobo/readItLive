var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	body : String,
	author : String,
	event : {type: 	mongoose.Schema.Types.ObjectId, ref: 'Event'}
});

mongoose.model('Post', PostSchema);
