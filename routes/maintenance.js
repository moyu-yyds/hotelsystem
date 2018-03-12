var express = require('express');
var router = express.Router();

var maintenperson = require('../model/maintenperson');
var maintenance = require('../model/maintenance');

router.get('/',function(req,res){
	res.send('success');
});

router.get('/restperson',function(req,res){
	maintenperson.find({state:'空闲'}).then(result=>{
		res.send(result);
	})
});

router.get('/allperson',function(req,res){
	maintenperson.find().then(result=>{
		res.send(result);
	})
});

router.post('/changepersonstate',function(req,res){
	if(req.body.state == 0){
		var person = JSON.parse(req.body.person);
		for(var i = 0 ; i < req.body.allperson.length ; i++){
			if(person._id == req.body.allperson[i]._id){
				maintenperson.findByIdAndUpdate(person._id,{$set:{state:'正在维修房间'}}).then(res.send('success'));
			}
		}
	}
	if(req.body.state == 1){
		maintenperson.find({name:req.body.name}).then(result=>{
			maintenperson.findByIdAndUpdate(result[0]._id,{$set:{state:'空闲'}}).then(res.send('success'));
		});
	}
});

router.post('/maintenancetable',function(req,res){
	var room = JSON.parse(req.body.room);
	var person = JSON.parse(req.body.person);
	maintenance.create({
		roomid:room.roomid,
		roomtype:room.roomtype,
		maintenperson:person.name,
		maintenitems:req.body.items,
		state:'维修中'
	}).then(res.send('success'));
}); 

router.post('/changemaintenance',function(req,res){
	maintenance.findByIdAndUpdate(req.body.id,{$set:{state:'已完成'}}).then(res.send('success'));
});

router.get('/allmaintenance',function(req,res){
	maintenance.find().then(result=>{
		res.send(result);
	});
});

module.exports = router;