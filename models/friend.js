var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FriendSchema = new Schema({
	screen_name: {
		type:String,
		unique:false,
		require:true
	},
	id: {
		type: Number,
		required:true
	},
	last_updated: {
		type:Date,
		default:Date.now
	}
});

module.exports = mongoose.model('Friend', FriendSchema);