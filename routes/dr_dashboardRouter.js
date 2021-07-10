var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var objectId= require('mongodb').ObjectId;


const DoctorQueue = require('../models/doctorqueue');
const Doctor = require('../models/doctor');


const dr_dashboardRouter = express.Router();
dr_dashboardRouter.use(bodyParser.json())

dr_dashboardRouter.route('/')

.get((req,res,next)=>{
	Doctor.findById("60e83ba64a556a1d908703c3")
	.then((doc)=>{
		 res.render('dashboard',{doctor:doc});
	})
   
})

dr_dashboardRouter.route('/60e83ba64a556a1d908703c3')
.get((req,res,next)=>{
    Doctor.findById("60e83ba64a556a1d908703c3")
	.then((doc)=>{
		console.log(doc.email);
		 res.render('update',{doctor:doc});
	})
})

.post((req,res,next)=>{
	var fl=req.files;
	Doctor.updateOne({_id: objectId("60e83ba64a556a1d908703c3")}, {$set:{email: req.body.email,
		state:req.body.state,
		mobile:req.body.mobile,
		 Hospital_name:req.body.Hname,
      district:req.body.district,
      city:req.body.city

	}}, function (err,result) {
    if (err){
        console.log(err)
    }else{
        console.log(result); 
        res.send(req.body.email);
    }
})
	
})














module.exports = dr_dashboardRouter;