var express = require('express');
var router = express.Router();

var room = require('../model/room');
var roomprice = require("../model/roomprice");
var reservation = require('../model/reservation');
var pcheckinroom = require('../model/pcheckinroom');
var tcheckinroom = require('../model/tcheckinroom');

router.get('/',function(req,res){
	res.send('success');
});
 
router.get('/roomprice',function(req,res){
	roomprice.find().then(result=>{
		res.send(result);
	});
});

router.post('/updateroomprice',function(req,res){
	roomprice.findByIdAndUpdate(req.body.id,{$set:{
		roomdeposit:req.body.deposit,
		roomprice:req.body.roomprice,
		mostpeople:req.body.mostpeople
	}}).then(res.send('success'));
});

router.get('/allroom',function(req,res){
	room.find().then(result=>{
		res.send(result);
	});
});

router.get('/restroom',function(req,res){
	room.find({state:"空闲"}).then(result=>{
		res.send(result);
	});
});

router.get('/allreservation',function(req,res){
	reservation.find().then(result=>{
		res.send(result);
	});
});

router.post('/reservation',function(req,res){
	reservation.create({
		name:req.body.data.name,
		cardid:req.body.data.cardid,
		personumber:req.body.data.personumber,
		roominfo:req.body.data.roominfo,
		form:req.body.data.form,
		state:'预定中'
	}).then(result=>{
		res.send('success');
	});
});

router.post('/changereservation',function(req,res){
	if(req.body.state == 1){
		reservation.findByIdAndUpdate(req.body.id,{$set:{state:'已完成'}}).then(res.send('success'));
	}
	if(req.body.state == 2){
		reservation.findByIdAndUpdate(req.body.id,{$set:{state:'已取消'}}).then(res.send('success'));
	}
});

router.post('/changeroomstate',function(req,res){
	if(req.body.state == 0){
		function callback(num){
			room.findByIdAndUpdate(req.body.data[num]._id,{$set:{state:'已预定'}}).then(result=>{
				num=num+1;
				if(num < req.body.len){
					callback(num);
				}	
				if(num == req.body.len){
					res.send('success');
				}
			});
		}
		callback(0);
	}
	if(req.body.state == 1){
		var data = JSON.parse(req.body.data);
		room.findByIdAndUpdate(data._id,{$set:{state:'正在维修'}}).then(res.send('success'));
	}
	if(req.body.state == 2){
		var data = JSON.parse(req.body.data);
		room.findByIdAndUpdate(data._id,{$set:{state:'正在清洁'}}).then(res.send('success'));	
	}
	if(req.body.state == 3){
		room.findByIdAndUpdate(req.body.id,{
			$set:{
				state:'已入住',
				userinfo:req.body.person
			}
		}).then(res.send('success')); 
	}
	if(req.body.state == 4){
		function callback(num){
			room.findByIdAndUpdate(req.body.roominfo[num].id,{$set:{
				userinfo:req.body.person,
				state:'已入住'
			}}).then(result=>{
				num = num + 1;
				if(num < req.body.len){
					callback(num);
				}
				if(num == req.body.len){
					res.send('success');
				}
			});
		}
		callback(0);
	} 
	if(req.body.state == 5){
		room.find({roomid:req.body.roomid}).then(result=>{
			room.findByIdAndUpdate(result[0]._id,{$set:{state:'空闲',userinfo:[]}}).then(res.send('success'));
		});
	}
	if(req.body.state == 6){
		function callback(num){
			room.findByIdAndUpdate(req.body.roominfo[num].id,{$set:{userinfo:[],state:'空闲'}}).then(result=>{
				num = num + 1;
				if(num < req.body.len){
					callback(num);
				}
				if(num == req.body.len){
					res.send('success');
				}
			});
		}
		callback(0);
	}
});

router.post('/pcheckinroom',function(req,res){
	var first = JSON.parse(req.body.person[0]);
	pcheckinroom.create({
		firstname:first.name,
		firstcardid:first.cardid,
		roomid:req.body.roomid,
		roomtype:req.body.roomtype,
		allperson:req.body.person,
		casheveryday:req.body.casheveryday,
		deposit:req.body.deposit,
		prepaid:req.body.prepaid,
		cashtype:req.body.cashtype,
		state:'已入住'
	}).then(res.send('success'));
}); 

router.post('/changepcheckin',function(req,res){
	if(req.body.state == 0){
		pcheckinroom.findByIdAndUpdate(req.body.id,{$set:{state:'已退房'}}).then(res.send('success'));
	}
	if(req.body.state == 1){
		if(req.body.money >= 0){
			pcheckinroom.findByIdAndUpdate(req.body.id,{$set:{prepaid:req.body.money}}).then(res.send('success'));
		}
		if(req.body.money >= -5000 && req.body.money < 0){
			pcheckinroom.findByIdAndUpdate(req.body.id,{$set:{state:'已欠费',prepaid:req.body.money}}).then(res.send('success'));
		}
		if(req.body.money < -5000){
			pcheckinroom.findByIdAndUpdate(req.body.id,{$set:{state:'已成坏账',prepaid:req.body.money}}).then(res.send('success'));
		}
	}
});

router.post('/changetcheckin',function(req,res){
	if(req.body.state == 0){
		tcheckinroom.findByIdAndUpdate(req.body.id,{$set:{state:'已退房'}}).then(res.send('success'));
	}
	if(req.body.state == 1){
		if(req.body.money >= 0){
			tcheckinroom.findByIdAndUpdate(req.body.id,{$set:{prepaid:req.body.money}}).then(res.send('success'));
		}
		if(req.body.money >= -5000 && req.body.money < 0){
			tcheckinroom.findByIdAndUpdate(req.body.id,{$set:{state:'已欠费',prepaid:req.body.money}}).then(res.send('success'));
		}
		if(req.body.money < -5000){
			tcheckinroom.findByIdAndUpdate(req.body.id,{$set:{state:'已成坏账',prepaid:req.body.money}}).then(res.send('success'));
		}
	}
});
  
router.post('/tcheckinroom',function(req,res){
	var first = JSON.parse(req.body.person[0]);
	tcheckinroom.create({
		firstname:first.name,
		firstcardid:first.cardid,
		roominfo:req.body.roominfo,
		allperson:req.body.person,
		casheveryday:req.body.casheveryday,
		prepaid:req.body.prepaid,
		cashtype:req.body.cashtype,
		state:'已入住'
	}).then(res.send('success'));
});

router.get('/allpcheckinroom',function(req,res){
	pcheckinroom.find().then(result=>{
		res.send(result);
	});
});

router.get('/badpcheckinroom',function(req,res){
	pcheckinroom.find({state:'已成坏账'}).then(result=>{
		res.send(result);
	});
});

router.get('/owepcheckinroom',function(req,res){
	pcheckinroom.find({state:'已欠费'}).then(result=>{
		res.send(result);
	});
});

router.get('/alltcheckinroom',function(req,res){
	tcheckinroom.find().then(result=>{
		res.send(result);
	});
}); 

router.get('/badtcheckinroom',function(req,res){
	tcheckinroom.find({state:'已成坏账'}).then(result=>{
		res.send(result);
	}); 
});

router.get('/owetcheckinroom',function(req,res){
	tcheckinroom.find({state:'已欠费'}).then(result=>{
		res.send(result);
	});
}); 

router.post('/renewal',function(req,res){
	if(req.body.state == 0){
		if(req.body.type == '个人'){
			pcheckinroom.find({firstname:req.body.name,firstcardid:req.body.cardid,cashtype:'会员'}).then(result=>{
				if(result[0]){
					if(result[0].state != '已退房'){
						var state ='';
						if(req.body.money >= 0){
							state='已入住';
						}
						if(req.body.money < 0 && req.body.money >= -5000){
							state = '已欠费';
						}
						if(req.body.money < -5000){
							state = '已成坏账';
						}
						pcheckinroom.findByIdAndUpdate(result[0]._id,{$set:{
						prepaid:req.body.money,
						state
						}}).then(res.send('success'));
					}
				}
				else{
					res.send('fail');
				}
			});
		}
		if(req.body.type == '团体'){
			tcheckinroom.find({firstname:req.body.name,firstcardid:req.body.cardid,cashtype:'会员'}).then(result=>{
				if(result[0]){
					if(result[0].state != '已退房'){
						var state ='';
						if(req.body.money >= 0){
							state='已入住';
						}
						if(req.body.money < 0 && req.body.money >= -5000){
							state = '已欠费';
						}
						if(req.body.money < -5000){
							state = '已成坏账';
						}
						tcheckinroom.findByIdAndUpdate(result[0]._id,{$set:{
						prepaid:req.body.money
						}}).then(res.send('success'));
					}
				}
				else{
					res.send('fail');
				}
			});
		}
	}
	if(req.body.state == 1){
		var state ='';
		if(req.body.money >= 0){
			state='已入住';
		}
		if(req.body.money < 0 && req.body.money >= -5000){
			state = '已欠费';
		}
		if(req.body.money < -5000){
			state = '已成坏账';
		}
		pcheckinroom.findByIdAndUpdate(req.body.id,{$set:{prepaid:req.body.money,state}}).then(res.send('success'));
	}
	if(req.body.state == 2){
		var state ='';
		if(req.body.money >= 0){
			state='已入住';
		}
		if(req.body.money < 0 && req.body.money >= -5000){
			state = '已欠费';
		}
		if(req.body.money < -5000){
			state = '已成坏账';
		}
		tcheckinroom.findByIdAndUpdate(req.body.id,{$set:{prepaid:req.body.money}}).then(res.send('success'));
	}
});
 
module.exports = router ;