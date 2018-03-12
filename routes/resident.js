var express = require('express');
var router = express.Router();

var resident = require('../model/resident');
var personvip = require('../model/personvip');
var teamvip = require('../model/teamvip');

router.get('/',function(req,res){
	res.send('success');
});

router.get('/allresident',function(req,res){
	resident.find().then(result=>{
		res.send(result);
	});
});

router.post('/searchsb',function(req,res){
	resident.find({
		residentname:req.body.name,
		residentcardid:req.body.cardid
	}).then(result=>{
		res.send(result);         
	});
});

router.post('/vip',function(req,res){
	if(req.body.flag == 1){
		resident.create({
			state:['个人会员'],
			residentname:req.body.name,
			residentcardid:req.body.cardid,
			checknum:0
		}).then(result=>{
			personvip.create({
				username:req.body.name,
				usercardid:req.body.cardid,
				record:[`充值${req.body.money}`],
				money:req.body.money,
				viptype:'个人'
			}).then(res.send('success'));
		});
		
	}
	if(req.body.flag == 2){
		resident.create({
			state:['团体会员'],
			residentname:req.body.name,
			residentcardid:req.body.cardid,
			checknum:0
		}).then(result=>{
			teamvip.create({
				username:req.body.name,
				usercardid:req.body.cardid,
				record:[`充值${req.body.money}`],
				money:req.body.money,
				viptype:'团体'
			});
		});
	}
	if(req.body.flag == 3){
		var state = Array.from(req.body.state);
		state.push('个人会员');
		resident.findByIdAndUpdate(req.body.id,{$set:{state:state}}).then(result=>{
			personvip.create({
				username:req.body.name,
				usercardid:req.body.cardid,
				record:[`充值${req.body.money}`],
				money:req.body.money,
				viptype:'个人'
			}).then(res.send('success'));
		});	
	}
	if(req.body.flag == 4){
		var state = Array.from(req.body.state);
		state.push('团体会员');
		resident.findByIdAndUpdate(req.body.id,{$set:{state:state}}).then(result=>{
			teamvip.create({
				username:req.body.name,
				usercardid:req.body.cardid,
				record:[`充值${req.body.money}`],
				money:req.body.money,
				viptype:'团体'
			}).then(res.send('success'));
		});
	}
});

router.post('/removevip',function(req,res){
	var item = JSON.parse(req.body.item);
	if(item.viptype == '个人'){
		//先更新个人会员表，再更新住户表
		personvip.findByIdAndRemove(item._id).then(results=>{
			resident.find({
				residentname:item.username,
				residentcardid:item.usercardid
			}).then(result=>{
				var state = Array.from(result[0].state) ;
				var i = 0 ;
				var reallystate = [];
				while(state[i]){
					if(state[i] != '个人会员'){
						reallystate.push(state[i]);
					}
					i++;
				}
				resident.findByIdAndUpdate(result[0]._id,{$set:{
					state:reallystate
				}}).then(res.send('success'));
			});
		});	
	}
	if(item.viptype == '团体'){
		teamvip.findByIdAndRemove(item._id).then(results=>{
			resident.find({
				residentname:item.username,
				residentcardid:item.usercardid
			}).then(result=>{
				var state = Array.from(result[0].state) ;
				var i = 0 ;
				var reallystate = [];
				while(state[i]){
					if(state[i] != '团体会员'){
						reallystate.push(state[i]);
					}
					i++;
				}
				resident.findByIdAndUpdate(result[0]._id,{$set:{
					state:reallystate
				}}).then(res.send('success'));
			});
		});	
	}
});

router.get('/allpersonvip',function(req,res){
	personvip.find().then(result=>{
		res.send(result);
	});
});

router.get('/allteamvip',function(req,res){
	teamvip.find().then(result=>{
		res.send(result);
	});
});

router.post('/judgepersonvip',function(req,res){
	personvip.find({
		username:req.body.oneperson.name,
		usercardid:req.body.oneperson.cardid
	}).then(result=>{
		res.send(result);
	});
});

router.post('/judgeteamvip',function(req,res){
	teamvip.find({
		username:req.body.oneperson.name,
		usercardid:req.body.oneperson.cardid
	}).then(result=>{
		res.send(result);
	});
}); 

router.post('/updatevip',function(req,res){
	var record = Array.from(req.body.record);
	record.push(`充值${req.body.money}`);
	if(req.body.viptype == '个人'){
		personvip.findByIdAndUpdate(req.body.id,{$set:{
			record,
			money:req.body.allmoney
		}}).then(res.send('success'));
	}
	if(req.body.viptype == '团体'){
		teamvip.findByIdAndUpdate(req.body.id,{$set:{
			record,
			money:req.body.allmoney
		}}).then(res.send('success'));
	}
});
 
router.post('/viprenewal',function(req,res){
	if(req.body.state == 1){
		personvip.find({
			username:req.body.name,
			usercardid:req.body.cardid
		}).then(result=>{
			var record = Array.from(result[0].record);
			record.push(`充值${req.body.money}`);
			personvip.findByIdAndUpdate(result[0]._id,{$set:{money:req.body.money,record}}).then(res.send('success'));
		});
	}
	if(req.body.state == 2){
		teamvip.find({
			username:req.body.name,
			usercardid:req.body.cardid
		}).then(result=>{
			var record = Array.from(result[0].record);
			record.push(`充值${req.body.money}`);
			teamvip.findByIdAndUpdate(result[0]._id,{$set:{record,money:req.body.money}}).then(res.send('success'));
		});
	}
});

router.post('/deduction',function(req,res){
	if(req.body.state == 1){
		personvip.find({
			username:req.body.name,
			usercardid:req.body.cardid
		}).then(result=>{
			var record = Array.from(result[0].record);
			var money = req.body.money ;
			if(money < 0){
				record.push(`充值${-money}`);
				money = 0 ;
			} 
			record.push(`扣费${req.body.moneyeveryday}`);
			personvip.findByIdAndUpdate(result[0]._id,{$set:{money,record}}).then(res.send('success'));
		});
	}
	if(req.body.state == 2){
		teamvip.find({
			username:req.body.name,
			usercardid:req.body.cardid
		}).then(result=>{
			var record = Array.from(result[0].record);
			var money = req.body.money ;
			if(money < 0){
				record.push(`充值${-money}`);
				money = 0 ;
			} 
			record.push(`扣费${req.body.moneyeveryday}`);
			teamvip.findByIdAndUpdate(result[0]._id,{$set:{money,record}}).then(res.send('success'));
		});
	}
	if(req.body.state == 3){
		personvip.find({
			username:req.body.name,
			usercardid:req.body.cardid
		}).then(result=>{
			var record = Array.from(result[0].record);
			var money = req.body.money ;
			record.push(`扣费${req.body.moneyeveryday}`);
			personvip.findByIdAndUpdate(result[0]._id,{$set:{money,record}}).then(res.send('success'));
		});
	}
	if(req.body.state == 4){
		teamvip.find({
			username:req.body.name,
			usercardid:req.body.cardid
		}).then(result=>{
			var record = Array.from(result[0].record);
			var money = req.body.money ;
			record.push(`扣费${req.body.moneyeveryday}`);
			teamvip.findByIdAndUpdate(result[0]._id,{$set:{money,record}}).then(res.send('success'));
		});
	}
});

router.post('/updateresident',function(req,res){
	for(var i = 0 ; i < req.body.len ; i++){
		var person = JSON.parse(req.body.person[i]);
		resident.find({
			residentname:person.name,
			residentcardid:person.cardid
		}).then(result=>{
			if(!result[0]){
				resident.create({
					state:['普通客人'],
					residentname:person.name,
					residentcardid:person.cardid,
					checknum:1
				}).then(res.send('success'));
			}else{
				var state = Array.from(result[0].state);
				for(var i = 0 ; i < state.length ; i++){
					if(state[i] == '普通客人'){
						break;
					}
				}
				if(i == state.length){
					state.push('普通客人');
				}
				resident.findByIdAndUpdate(result[0]._id,{
					$set:{checknum:result[0].checknum+1,state:state}
				}).then(res.send('success'));
			}
		})
	}
});

module.exports = router;