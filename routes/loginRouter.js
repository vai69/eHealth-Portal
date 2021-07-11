var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');




const DoctorQueue = require('../models/doctorqueue');
const Doctor = require('../models/doctor');
const PatientQueue = require('../models/patientqueue');
const Patient = require('../models/patient');


const loginRouter = express.Router();
loginRouter.use(cookieParser());
loginRouter.use(bodyParser.json())

loginRouter.route('/')

.get((req,res,next)=>{
    var type = req.cookies.type;
    var user = req.cookies.user;

    if(type == 'patient')
    {
        res.redirect('/pdashboard');
    }
    else if(type == 'doctor')
    {
        res.redirect('/dashboard');
    }
    else if(type == 'admin')
    {
        res.redirect('/admin');
    }
    else
        res.render("login");
})


.post((req,res,next)=>{
    var username = req.body.username;
    var password = req.body.password;


    if(username == 'admin' && password == 'admin')
    {
        res.cookie('user', 'admin', { maxAge: 86400000, httpOnly: true });
        res.cookie('type', 'admin', { maxAge: 86400000, httpOnly: true });
        res.redirect('/admin');
    }
    else{
        Patient.findOne({
            username : req.body.username ,
            password : req.body.password 
        })
        .then((doc)=>{
            if(doc != null)
            {
                res.cookie('user', doc._id , { maxAge: 86400000, httpOnly: true });
                res.cookie('type', 'patient', { maxAge: 86400000, httpOnly: true });
                res.redirect('/pdashboard');
            }
            else
            {   
                Doctor.findOne({
                    username : req.body.username,
                    password : req.body.password
                })
                .then((doc)=>{
                    if(doc != null)
                    {
                        res.cookie('user', doc._id , { maxAge: 86400000, httpOnly: true });
                        res.cookie('type', 'doctor', { maxAge: 86400000, httpOnly: true });
                        res.redirect('/dashboard');
                    }
                    else
                    {
                        res.send("No such user")
                    }
                })
            }
        })
    }
})



module.exports = loginRouter;