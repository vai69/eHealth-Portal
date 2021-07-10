var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressFileUpload = require('express-fileupload');


const Patient = require('../models/patient');
const PatientQueue = require('../models/patientqueue');


var patientRouter = express.Router();

// middlewares

patientRouter.use(express.json());
patientRouter.use(bodyParser.json());
patientRouter.use(expressFileUpload());



// Require static assets from public folder
patientRouter.use(express.static(path.join(__dirname, './../public')));


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});


patientRouter.route('/')


.get(  (req,res,next)=>{
    
    // res.send(__dirname + "/../public/patient.html");
    res.sendFile( __dirname + "/../public/patient.html");
    // res.render('patient');
  })
  
.post( (req,res,next)=>{
  
  
    console.log(req);
    // var pat = new PatientQueue();
  
  
    // pat.username = req.body.username;
    // pat.DOB = req.body.DOB; 
    // pat.name = req.body.name;
    // pat.email = req.body.email;
    // pat.mobile = req.body.mobile;
    // pat.bloodGr = req.body.bloodGr ;
    // pat.state = req.body.state;
    // pat.district = req.body.district;
    // pat.aadhar = req.body.aadhar;
    // // pat.image.data = req.files.myFile.data;
    // // pat.image.contentType = req.files.myFile.name.split('.').pop();
    // pat.nomeneeAadhar = req.body.nomeneeAadhar;
  
    // res.send(res.files.myFile.data);
  
    // PatientQueue.create( pat )
    // .then((doc)=>{
    //     // res.statusCode = 200;
    //     // res.setHeader("Content-Type" , 'application/json');
    //     // res.json(doc);
    //     res.send("Data Added Successfully");
    // }), (err)=>next(err)
    // .catch((err)=>next(err));
   
  })
  
  
module.exports = patientRouter