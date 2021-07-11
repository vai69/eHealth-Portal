var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var objectId= require('mongodb').ObjectId;




const PatientQueue = require('../models/patientqueue');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Appoint = require('../models/Appoint');


const pat_dashboardRouter = express.Router();
pat_dashboardRouter.use(cookieParser());
pat_dashboardRouter.use(bodyParser.json());

pat_dashboardRouter.route('/')

.get((req,res,next)=>{
	 

  var user = req.cookies.user;
  var type = req.cookies.type;

  if(type == 'patient')
  {
    Patient.findById(user)
    .then((doc)=>{
     res.render('pdashboard',{patient:doc});
    })
  }
  else
  {
    res.redirect('/');
  }
})

pat_dashboardRouter.route('/:patID')

.get((req,res,next)=>{
  

  var user = req.cookies.user;
  var type = req.cookies.type;

  if(type == 'patient')
  {
    Doctor.find({})
    .then((doc)=>{
        res.render('pat_appointment_dash' , { doctor : doc });
    })
  }
  else
  {
    res.redirect('/');
  }
    
})

.post((req,res,next)=>{

  var user = req.cookies.user;
  var type = req.cookies.type;

  if(type == 'patient')
  {
    var obj={
      pat_id:user,
      doc_id: req.body.doctor,
      date:req.body.DOA,
      meet_url:"https://majestic-voyageurs-80869.herokuapp.com/"+ "60e938f414932c0cbc4aaf29" +"-1-0-"+ req.body.doctor
    }
    console.log(obj.meet_url)
    Appoint.create(obj)
    .then((doc) => {
        //res.statusCode = 200;
        //res.setHeader("Content-Type" , 'application/json');
        //res.json(obj);
    }), (err) => next(err)
    .catch((err) => next(err));

    res.send("hgjh")
  }
  else
  {
    res.redirect('/');
  }
  

})
















module.exports = pat_dashboardRouter;