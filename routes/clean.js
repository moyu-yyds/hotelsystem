var express = require('express');
var router = express.Router();

var cleanperson = require('../model/cleanperson');
var clean = require('../model/clean');

router.get('/',function(req,res){
	res.send('success');
});

router.get('/restperson',function(req,res){
	cleanperson.find({state:'空闲'}).then(result=>{
		res.send(result);
	})
});

router.get('/allperson',function(req,res){
	cleanperson.find().then(result=>{
		res.send(result);
	})
});

router.post('/changepersonstate',function(req,res){
	if(req.body.state == 0){
		var person = JSON.parse(req.body.person);
		for(var i = 0 ; i < req.body.allperson.length ; i++){
			if(person._id == req.body.allperson[i]._id){
				cleanperson.findByIdAndUpdate(person._id,{$set:{state:'正在清洁房间'}}).then(res.send('success'));
			}
		} 
	}
	if(req.body.state == 1){
		cleanperson.find({name:req.body.name}).then(result=>{
			cleanperson.findByIdAndUpdate(result[0]._id,{$set:{state:'空闲'}}).then(res.send('success'));
		});
	}
});

router.post('/changeclean',function(req,res){
	clean.findByIdAndUpdate(req.body.id,{$set:{state:'已完成'}}).then(res.send('success'));
});

router.post('/cleantable',function(req,res){
	var room = JSON.parse(req.body.room);
	var person = JSON.parse(req.body.person);
	clean.create({
		roomid:room.roomid,
		roomtype:room.roomtype,
		cleanperson:person.name,
		state:'清洁中'
	}).then(res.send('success'));
});

router.get('/allclean',function(req,res){
	clean.find().then(result=>{
		res.send(result);
	});
});

module.exports = router;