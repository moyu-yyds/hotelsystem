var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
	name:String,
	cardid:String,
	personumber:Number,
	roominfo:Array,
	form:String ,                 //是个人预定还是团队预定
	state:String
});

module.exports = mongoose.model('reservation',reservationSchema);