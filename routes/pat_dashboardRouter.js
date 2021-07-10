var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var objectId= require('mongodb').ObjectId;


const PatientQueue = require('../models/patientqueue');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');


const pat_dashboardRouter = express.Router();
pat_dashboardRouter.use(bodyParser.json())

pat_dashboardRouter.route('/')

.get((req,res,next)=>{
	Doctor.findById("60e83ba64a556a1d908703c3")
	.then((doc)=>{
		 res.send("in patient pat_dashboardRouter");
	})
   
})















module.exports = pat_dashboardRouter;