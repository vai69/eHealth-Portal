var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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
var Doctor = require('../models/doctor');
var DoctorQueue = require('../models/doctorqueue');


const adminRouter = express.Router();


adminRouter.use(cookieParser());
adminRouter.use(bodyParser.json());




adminRouter.route('/')


.get((req,res,next)=>{

    var type = req.cookies.type;
    var user = req.cookies.user;

    if(type == 'admin')
    {
        PatientQueue.find({})
        .then((patQueue)=>{
            DoctorQueue.find({})
            .then((doctorQueue)=>{
                res.render('queue' , { patQueue : patQueue , doctorQueue : doctorQueue});
            })    
        })
    }
    else
    {
        res.redirect('/');
    }
});



adminRouter.route('/verified')

.get((req,res,next)=>{


    var type = req.cookies.type;
    var user = req.cookies.user;

    if(type == 'admin')
    {
        Patient.find({})
        .then((pat)=>{
            Doctor.find({})
            .then((doctor)=>{
                res.render('verifiedQueue' , { patQueue : pat , doctorQueue : doctor});
            })
        })
    }
    else
    {
        res.redirect('/');
    }

    
})

adminRouter.route('/verified/:patID')
.get((req,res,next)=>{


    var type = req.cookies.type;
    var user = req.cookies.user;

    if(type == 'admin')
    {
        Patient.findById(req.params.patID)
        .then((doc)=>{
            // res.statusCode = 200;
            // res.setHeader("Content-Type" , "application/json");
        
            const url =   doc._id.toString();

            const str = doc.image.data.toString('base64');

            var img = {
                contentType: doc.image.contentType,
                data : str
            }
            // res.send(img);
            res.render('verifiedInfo' , { patient : doc , postURL : url , image : img , certs : [] , isPat : 1});
        },(err)=>{
            console.log("Not Found in patient");
        })
        .catch((err)=>{
            console.log("Not Found in patient2.0");
            Doctor.findById(req.params.patID)
            .then((doc)=>{
                // res.send("YOO");
                const url =   doc._id.toString();
                const str = doc.Id_proof.data.toString('base64');
                var img = {
                    contentType: doc.Id_proof.contentType,
                    data : str
                }

                var certs = [];
                for(var i = 0; i<doc.Certificates.length;i++ )
                {
                    const cur_str = doc.Id_proof.data.toString('base64');
                    var cur_img = {
                        contentType: doc.Id_proof.contentType,
                        data : cur_str
                    }
                    certs.push(cur_img);
                }

                // res.send(certs);
                res.render('verifiedInfo' , { patient : doc , postURL : url , image : img , certs : certs ,isPat : 0});

            },(err)=>{
                console.log("Not Found in Doctor");
            })
        })
    }
    else{
        res.redirect('/');
    }


})




adminRouter.route('/:patID')


.get((req,res,next)=>{

    var type = req.cookies.type;
    var user = req.cookies.user;

    if(type == 'admin')
    {
        PatientQueue.findById(req.params.patID)
        .then((doc)=>{
            // res.statusCode = 200;
            // res.setHeader("Content-Type" , "application/json");
        
            const url =   doc._id.toString();

            const str = doc.image.data.toString('base64');

            var img = {
                contentType: doc.image.contentType,
                data : str
            }
            // res.send(img);
            res.render('verify' , { patient : doc , postURL : url , image : img , certs : [] , isPat : 1});
        },(err)=>{
            console.log("Not Found in patient");
        })
        .catch((err)=>{
            console.log("Not Found in patient2.0");
            DoctorQueue.findById(req.params.patID)
            .then((doc)=>{
                // res.send("YOO");
                const url =   doc._id.toString();
                const str = doc.Id_proof.data.toString('base64');
                var img = {
                    contentType: doc.Id_proof.contentType,
                    data : str
                }

                var certs = [];
                for(var i = 0; i<doc.Certificates.length;i++ )
                {
                    const cur_str = doc.Id_proof.data.toString('base64');
                    var cur_img = {
                        contentType: doc.Id_proof.contentType,
                        data : cur_str
                    }
                    certs.push(cur_img);
                }

                // res.send(certs);
                res.render('verify' , { patient : doc , postURL : url , image : img , certs : certs ,isPat : 0});

            },(err)=>{
                console.log("Not Found in Doctor");
            })
        })
    }
    else
    {
        res.redirect('/');
    }
})

.post((req,res,next)=>{

    var type = req.cookies.type;
    var user = req.cookies.user;

    if(type == 'admin')
    {
        var comment = req.body.comment;
        var submitType = req.body.submit.split('$')[0];
        var curEmail =  req.body.submit.split('$')[1]
        // res.send(curEmail);

        if( submitType === "success")
        {
            var flg=1
            console.log(req.params.patID)
            PatientQueue.findByIdAndDelete(req.params.patID)
            .then((doc)=>{
                flg=0
                console.log("in patient")
               Patient.insertMany([doc])
                        .then(()=>{
                            console.log("in mail")
                                var mailOptions = {
                                    from: process.env.EMAIL,
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
                                res.send("patient")
                        })
                .catch((err)=>{
                    if(flg==1){
                    DoctorQueue.findByIdAndDelete(req.params.patID)
                    .then((doc)=>{
                        console.log("in doctor")
                        Doctor.insertMany([doc])
                        .then(()=>{
                                var mailOptions = {
                                    from: process.env.EMAIL,
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
                    });
                }
                })
            } , (err)=>{
                console.log("Error in Admin route 1.0");
            })
            .catch((err)=>{
                console.log("Error in Admin route 2.0");
            })
        }
        else
        {
            PatientQueue.findByIdAndDelete(req.params.patID)
            .then((doc)=>{
                
                if(doc == null)
                {   
                    // res.send(req.params.patID);
                    DoctorQueue.findByIdAndDelete(req.params.patID)
                    .then((doc)=>{
                        var mailOptions = {
                            from: process.env.EMAIL,
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
            
                        res.send(`The appliction from ${curEmail} (doctor) is  reverted back`);
                    })
                }
                else
                {
                    var mailOptions = {
                        from: process.env.EMAIL,
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
        
                    res.send(`The appliction from ${curEmail} (patient) is  reverted back`);
                }
                
            },(err)=>{
                console.log("Error in Admin route 1.0");
            })
            .catch((err)=>{
                console.log("Error in Admin route 1.0");
            })
        }
    }
    else
    {
        res.redirect('/');
    }
   
})

module.exports = adminRouter;