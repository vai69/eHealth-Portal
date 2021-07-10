var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
require('dotenv/config');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

const DoctorQueue = require('../models/doctorqueue');
const Doctor = require('../models/doctor');


const adminRouter = express.Router();
adminRouter.use(bodyParser.json());




adminRouter.route('/')

.get((req,res,next)=>{
    DoctorQueue.find({})
    .then((doc)=>{
        res.render('queue' , { docQueue : doc });
        //res.send(doc);

    })
});




adminRouter.route('/:patID')


.get((req,res,next)=>{
    DoctorQueue.findById(req.params.patID)
    .then((doc)=>{
        // res.statusCode = 200;
        // res.setHeader("Content-Type" , "application/json");
        // res.send(doc);
        const url =   doc._id.toString();

        const str1 = doc.Id_proof.data.toString('base64');

        var img1 = {
            contentType: doc.Id_proof.contentType,
            data : str1
        }
       
        var img2=[];
        for(var i=0;i<doc.Certificates.length;i++)
        {
             const str2 = doc.Certificates[i].data.toString('base64');
             var ob={
                contentType: doc.Certificates[i].contentType,
                data : str2
             }
             img2.push(ob);
        }
        

        res.render('verify' , { doctor : doc , postURL : url , image1 : img1 ,image2:img2});
    })
})

.post((req,res,next)=>{
    var comment = req.body.comment;
    var submitType = req.body.submit.split('$')[0];
    var curEmail =  req.body.submit.split('$')[1];
    console.log(`${curEmail}`);

    if( submitType === "success")
    {
        console.log(req.params.patID);

        DoctorQueue.findByIdAndDelete(req.params.patID)
        .then((doc)=>{
            Doctor.insertMany([doc])
            .then(()=>{

                    var mailOptions = {
                        from: 'narutohiddenleaf2002@gmail.com',
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
        DoctorQueue.findByIdAndDelete(req.params.patID)
        .then((doc)=>{


            var mailOptions = {
                from: 'narutohiddenleaf2002@gmail.com',
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
    res.send("I am in post");
})



module.exports = adminRouter;
