var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roompriceSchema = new Schema({
	roomtype:String,
	roomdeposit:Number,
	roomprice:Number,
	mostpeople:Number
});

module.exports = mongoose.model('roomprice',roompriceSchema);