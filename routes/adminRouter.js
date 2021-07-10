var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


const PatientQueue = require('../models/patientqueue');
const Patient = require('../models/patient');


const adminRouter = express.Router();
adminRouter.use(bodyParser.json());




adminRouter.route('/')

.get((req,res,next)=>{
    PatientQueue.find({})
    .then((doc)=>{
        res.render('queue' , { patQueue : doc });
        res.send(doc);
    })
});



adminRouter.route('/:patID')


.get((req,res,next)=>{
    PatientQueue.findById(req.params.patID)
    .then((doc)=>{
        // res.statusCode = 200;
        // res.setHeader("Content-Type" , "application/json");
        // res.send(doc);
        const url =   doc._id.toString();
        res.render('verify' , { patient : doc , postURL : url });
    })
})

.post((req,res,next)=>{
    PatientQueue.findByIdAndDelete(req.params.patID)
    .then((doc)=>{
        Patient.insertMany([doc])
        .then(()=>{
            res.send("The patient :" + req.params.patID + " has been succesfully verified");
        })
        // res.send(doc);
    })
    // res.send(req.params.patID);
})

module.exports = adminRouter;
