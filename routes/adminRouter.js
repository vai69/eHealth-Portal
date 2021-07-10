var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv/config');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  
  
  
  
  
const PatientQueue = require('../models/patientqueue');
const Patient = require('../models/patient');


const adminRouter = express.Router();
adminRouter.use(bodyParser.json());




adminRouter.route('/')

.get((req,res,next)=>{
    PatientQueue.find({})
    .then((doc)=>{
        res.render('queue' , { patQueue : doc });
    })
});



adminRouter.route('/verified')
.get((req,res,next)=>{
    Patient.find({})
    .then((doc)=>{
        res.render('verifiedQueue' , { patQueue : doc });
        res.send(doc);
    })
})

adminRouter.route('/verified/:patID')
.get((req,res,next)=>{
    Patient.findById(req.params.patID)
    .then((doc)=>{
        // res.statusCode = 200;
        // res.setHeader("Content-Type" , "application/json");
        // res.send(doc);
        const url =   doc._id.toString();

        const str = doc.image.data.toString('base64');

        var img = {
            contentType: doc.image.contentType,
            data : str
        }

        res.render('verifiedInfo' , { patient : doc , postURL : url , image : img });
    })
})




adminRouter.route('/:patID')


.get((req,res,next)=>{
    PatientQueue.findById(req.params.patID)
    .then((doc)=>{
        // res.statusCode = 200;
        // res.setHeader("Content-Type" , "application/json");
        // res.send(doc);
        const url =   doc._id.toString();

        const str = doc.image.data.toString('base64');

        var img = {
            contentType: doc.image.contentType,
            data : str
        }

        res.render('verify' , { patient : doc , postURL : url , image : img });
    })
})

.post((req,res,next)=>{
    var comment = req.body.comment;
    var submitType = req.body.submit.split('$')[0];
    var curEmail =  req.body.submit.split('$')[1]
    res.send(curEmail);

    if( submitType === "success")
    {
        PatientQueue.findByIdAndDelete(req.params.patID)
        .then((doc)=>{
            Patient.insertMany([doc])
            .then(()=>{

                    var mailOptions = {
                        from: 'rohitsharrma74947@gmail.com',
                        to: curEmail,
                        subject: 'Sending Email using Node.js',
                        text: comment
                    };
                
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    res.send(`The applicant ${curEmail} is successfully verified`);
                });


            })
            .catch((err)=>next())
        })
        .catch((err)=>next())
    }
    else
    {
        PatientQueue.findByIdAndDelete(req.params.patID)
        .then((doc)=>{


            var mailOptions = {
                from: 'rohitsharrma74947@gmail.com',
                to: curEmail,
                subject: 'Sending Email using Node.js',
                text: comment
            };
        
            transporter.sendMail(mailOptions, (error, info)=>{
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.send(`The appliction from ${curEmail} is  reverted back`);
        })
        .catch((err)=>next())
    }
})




module.exports = adminRouter;
