var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var maintenpersonSchema = new Schema({
	name:String,
	sex:String,
	idcard:String,
	phonenumber:String,
	state:String
});

module.exports = mongoose.model('maintenperson',maintenpersonSchema);