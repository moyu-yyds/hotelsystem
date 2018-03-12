var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var maintenanceSchema = new Schema({
	roomid:String,
	roomtype:String,
	maintenperson:String,
	maintenitems:String,
	state:String
});

module.exports = mongoose.model('maintenance',maintenanceSchema);