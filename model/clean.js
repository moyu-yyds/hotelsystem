var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cleanSchema = new Schema({
	roomid:String,
	roomtype:String,
	cleanperson:String,
	state:String
});

module.exports = mongoose.model('clean',cleanSchema);