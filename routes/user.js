var express = require('express');
var router = express.Router();

var md5 = require('md5'); 

var user = require("../model/user");

router.get('/',function(req,res){
	res.send('suceess');
});

//获取所有的员工信息
router.get('/alluser',function(req,res){
	user.find().then(result=>{
		res.send(result);
	});
});

//验证手机号码及密码，并将结果返回前端
router.post('/validation',function(req,res){
	var data = JSON.parse(req.body.data) ;
	user.find({
		phonenumber:data.phonenumber,
		password:md5(data.password)
	}).then(result=>{
		if(result.length == 0){
			res.send('0');
		}else{
			res.send(result[0]);
		}
	});
});

//创建新的用户
router.post('/newuser',function(req,res){
	user.create({
		username:req.body.username,
		password:md5(req.body.password),
		cardid:req.body.cardid,
		email:req.body.email,
		phonenumber:req.body.phonenumber,
		birth:req.body.birth,
		sex:req.body.sex,
		address:req.body.address
	}).then(result=>{
		res.send('success');
	});
});

//修改用户密码
router.post('/changepassword',function(req,res){
	user.findByIdAndUpdate(req.body.id,{$set:{
		password:md5(req.body.wanted)
	}}).then(result=>{
		res.send('success');
	});
});

//删除用户
router.post('/removeuser',function(req,res){
	user.findByIdAndRemove(req.body.id).then(result=>{
		res.send('success');
	});
});

module.exports = router ;