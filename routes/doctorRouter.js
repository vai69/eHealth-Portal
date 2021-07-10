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

const Doctor = require('../models/doctor');
const DoctorQueue = require('../models/doctorqueue');
const Appoint = require('../models/Appoint');


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
 res.send("success");
  var degre=[];
        for (var i = 0; i < req.files.files.length; i++) {
            var ob={
              data: new Buffer(req.files.files[i].data,'base64'),
              contentType: req.files.files[i].name.split('.').pop()
            }
            degre.push(ob);
        }
        //res.send(degre);
   var obj={
    doc_no:1,
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
        data: new Buffer(req.files.Id_proof.data,'base64'),
        contentType: req.files.Id_proof.name.split('.').pop()
      },
      aadhar:req.body.aadhar,
      Certificates:degre
    }
  DoctorQueue.create(obj)
  .then((doc) => {
      //res.statusCode = 200;
      //res.setHeader("Content-Type" , 'application/json');
      //res.json(obj);
  }), (err) => next(err)
  .catch((err) => next(err));
     
})






module.exports = doctorRouter;



