var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name: {
		type: String,
		unique: false,
		required: true
	},
	due_date: {
		type: Date,
		unique: false,
		required: false
	}
})

// create a user model from this schema
module.exports = mongoose.model('Task', TaskSchema);