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
   //console.log(req.params);
    var user = req.cookies.user;
  var type = req.cookies.type;

  if(type == 'patient')
  {
   Patient.findById(objectId(user))
  .then((doc)=>{
    console.log(doc)
     res.render('pdashboard',{patient:doc});
  })
}
else
  {
    res.redirect('/');
  }
})


pat_dashboardRouter.route("/:patID")

.get((req,res,next)=>{
  var user = req.cookies.user;
  var type = req.cookies.type;

  if(type == 'patient')
  {
  console.log("i am in get");
    Doctor.find({})
    .then((doc)=>{
        res.render('pat_appointment_dash' , { doctor : doc });
        //console.log(doc);

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
    Patient.findOne({_id: user})
    .then((doc)=>{
          Doctor.findOneAndUpdate(
         { _id:  req.body.doctor}, 
         { $push: { 
                   appointments: {
                      pat_id:"0ea9292c389b7107415fb14",
                      date:req.body.DOA,
                      name:doc.name,
                      email:doc.email,
                      meet_url:"https://majestic-voyageurs-80869.herokuapp.com/"+ "0ea9292c389b7107415fb14" +"-1-2-0-"+ req.body.doctor
                     }  
                 } 
         })
        .then((doc) => {
            //res.statusCode = 200;
            //res.setHeader("Content-Type" , 'application/json');
            //res.json(obj);
        }), (err) => next(err)
        .catch((err) => next(err));
})

  res.send("hgjh");
}
else
{
  res.redirect('/');
}

})
















module.exports = pat_dashboardRouter;