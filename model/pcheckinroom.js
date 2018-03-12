var mongoose = require("mongoose");
var Schema = mongoose.Schema ;
  
var pcheckinroomSchema = new Schema({
	firstname:String,
	firstcardid:String,
	roomid:String,
	roomtype:String, 
	allperson:Array,
	casheveryday:Number,
	deposit:Number,
	prepaid:Number,
	cashtype:String,
	state:String
}); 

module.exports = mongoose.model('percheckinroom',pcheckinroomSchema);