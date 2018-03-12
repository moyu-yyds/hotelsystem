var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamvipSchema = new Schema({
	username:String,
	usercardid:String,
	record:Array,
	money:Number,
	viptype:String
});

module.exports = mongoose.model('teamvip',teamvipSchema);