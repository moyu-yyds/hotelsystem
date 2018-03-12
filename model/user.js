var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username:String,
	password:String,
	cardid:String,
	email:String,
	phonenumber:String,
	birth:String,
	sex:String,
	address:String
});

module.exports = mongoose.model("user",userSchema);