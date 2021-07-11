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

var doctorRouter = express.Router();

// middlewares
doctorRouter.use(bodyParser.json());


doctorRouter.route('/')



.get((req, res, next) => {
    res.render('doctor');
})

.post((req, res, next) => {
  //console.log(req.Id_proof);
 // res.send(req.files.files);
 
  var ob;
  var degre=[];
        for (var i = 0; i < req.files.files.length; i++) {
            ob={
              data: req.files.files[i].data,
              contentType: req.files.files[i].name.split('.').pop()
            }
            
            degre.push(ob);
        }
        

   var obj={
      doctor:1,
      username:req.body.username,
      password:req.body.password,
      DOB:req.body.DOB,
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      Specialization:req.body.Special,
      Hospital_name:req.body.Hname,
      state:req.body.state,
      district:req.body.district,
      city:req.body.city,


      Id_proof:{
        data: req.files.Id_proof.data,
        contentType: req.files.Id_proof.name.split('.').pop()
      },
      aadhar:req.body.aadhar,
      Certificates:degre
    } 

    // res.send("Yoo");
    var docq , doc;
    PatientQueue.findOne({username : req.body.username})
    .then((result)=>{
      if(result == null)
      {
        Patient.findOne({username : req.body.username})
        .then((result)=>{
          if(result == null)
          {
                if(doc == null && docq == null)
                {
                  DoctorQueue.create(obj)
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



doctorRouter.route('/search')

.get((req,res,next)=>{
    res.render('search');
})

.post((req,res,next)=>{
  
  Patient.findOne({ aadhar : req.body.aadhar })
  .then((doc)=>{
    
    if(doc == null)
    {
      res.send("No such Patient");
    }
    else
    {
      
        const url =   doc._id.toString();

        const str = doc.image.data.toString('base64');

        var img = {
            contentType: doc.image.contentType,
            data : str
        }
        // res.send(doc);
        res.render('verifiedInfo' , { patient : doc , postURL : url , image : img , certs : [] , isPat : 1});
    
    }
  })
})




module.exports = doctorRouter;



