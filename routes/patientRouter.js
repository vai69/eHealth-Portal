var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



const Patient = require('../models/patient');
const PatientQueue = require('../models/patientqueue');


var patientRouter = express.Router();



// middlewares
patientRouter.use(bodyParser.json());


patientRouter.route('/')

.get((req,res,next)=>{
    res.render('patient');
})

.post((req,res,next)=>{
    PatientQueue.create( req.body )
    .then((doc)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type" , 'application/json');
        res.json(doc);
    }), (err)=>next(err)
    .catch((err)=>next(err));
 })








module.exports = patientRouter