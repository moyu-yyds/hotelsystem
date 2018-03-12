var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
	roomid:String,
	roomtype:String,
	state:String,
	userinfo:Array
});

module.exports = mongoose.model('room',roomSchema);