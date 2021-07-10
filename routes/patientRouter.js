var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });

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