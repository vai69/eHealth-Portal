var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var objectId= require('mongodb').ObjectId;


const PatientQueue = require('../models/patientqueue');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Appoint = require('../models/Appoint');


const pat_dashboardRouter = express.Router();
pat_dashboardRouter.use(bodyParser.json())

pat_dashboardRouter.route('/')

.get((req,res,next)=>{
	 //res.send("in patient dashboard");
   Patient.findById("60e938f414932c0cbc4aaf29")
  .then((doc)=>{
     res.render('pdashboard',{patient:doc});
  })
})

pat_dashboardRouter.route('/60e938f414932c0cbc4aaf29')
.get((req,res,next)=>{
  //res.send("i am in get");
    Doctor.find({})
    .then((doc)=>{
        res.render('pat_appointment_dash' , { doctor : doc });
        //console.log(doc);

    })
})

.post((req,res,next)=>{
  var obj={
        pat_id:"60e938f414932c0cbc4aaf29",
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

})
















module.exports = pat_dashboardRouter;