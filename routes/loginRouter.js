var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


const DoctorQueue = require('../models/doctorqueue');
const Doctor = require('../models/doctor');


const loginRouter = express.Router();
loginRouter.use(bodyParser.json())

loginRouter.route('/')

.get((req,res,next)=>{
    res.render("login");
})


.post((req,res,next)=>{
    
})














module.exports = loginRouter;