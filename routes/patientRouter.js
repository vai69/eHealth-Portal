var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');
const fileUpload = require('express-fileupload');


/*var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({ storage: storage });*/

const Patient = require('../models/patient');
const PatientQueue = require('../models/patientqueue');
const Doctor = require('../models/doctor');
const DoctorQueue = require('../models/doctorqueue');


var patientRouter = express.Router();

// middlewares
patientRouter.use(bodyParser.json());


patientRouter.route('/')



.get((req, res, next) => {
    res.render('patient');
})

.post((req, res, next) => {
  //console.log(req.Id_proof);
 // res.send(req.files.files);
  //var degre=[];
        //for (var i = 0; i < req.files.files.length; i++) {
            //var ob={
              //data: new Buffer(req.files.files[i].data,'base64'),
              //contentType: req.files.files[i].name.split('.').pop()
            //}
            //degre.push(ob);
        //}
        //res.send(degre);
    console.log(req.files.myFile);
   var obj={
        pat_no:2,
      username:req.body.username,
      password:req.body.password,
      DOB:req.body.DOB,
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      bloodGr:req.body.bloodGr,
      state:req.body.state,
      district:req.body.district,
      image:{
        data: new Buffer(req.files.myFile.data,'base64'),
        contentType: req.files.myFile.name.split('.').pop()
      },
      aadhar:req.body.aadhar,
      nomeneeAadhar:req.body.nomeneeAadhar
    }


  var docq , doc;


  
  DoctorQueue.findOne({username : req.body.username})
  .then((result)=>{
    if(result == null)
    {
      Doctor.findOne({username : req.body.username})
      .then((result)=>{
        if(result == null)
        {
              if(doc == null && docq == null)
              {
                PatientQueue.create(obj)
                .then((doc) => {
                    res.send(doc);
                },(err) => {
                  res.send("try some other username");
                })
                .catch((err) => {
                  res.send("try some other username");
                });
              }
              else
              {
                res.send("try some other username");
              }
        }
        else
        {
          res.send("try some other username");
        }
      })
    }
    else
      res.send("try some other username");
  });

      
})






module.exports = patientRouter;



