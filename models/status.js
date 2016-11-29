var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var StatusSchema = new Schema({
	id_str: {
		type:String,
		required:true,
		unique:true
	},
	text: {
		type:String,
		required:true
	},
	user : {
		id_str: {
		type: String,
		required:true
		},
		screen_name: {
			type:String,
			required:true
		},
		location: {
			type:String,
			default:''
		},	
		created_at: {
			type:Date,
			required:true
		}
	},
	last_updated: {
		type:Date,
		default:Date.now
	},
	created_at: {
		type:Date,
		required:true
	}

});

module.exports = mongoose.model('Status', StatusSchema);