var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var residentSchema = new Schema({
	residentname:String,
	residentcardid:String,
	state:Array,
	checknum:Number
});

module.exports = mongoose.model('resident',residentSchema);

