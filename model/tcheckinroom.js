var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var tcheckinroomSchema = new Schema({
	firstname:String,
	firstcardid:String,
	roominfo:Array,
	allperson:Array,
	casheveryday:Number,
	prepaid:Number,
	cashtype:String,
	state:String
});

module.exports = mongoose.model('tcheckinroom',tcheckinroomSchema);