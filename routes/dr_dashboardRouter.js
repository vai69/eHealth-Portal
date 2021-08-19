var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var objectId= require('mongodb').ObjectId;
var nodemailer = require('nodemailer');
var fileupload = require("express-fileupload");
const multer = require("multer");
const path = require('path');
var busboy = require('connect-busboy');
var cors= require('cors');
const alert = require('alert'); 


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

const DoctorQueue = require('../models/doctorqueue');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const dr_dashboardRouter = express.Router();

dr_dashboardRouter.use(bodyParser.json())
dr_dashboardRouter.use(busboy());


dr_dashboardRouter.route('/')

.get((req,res,next)=>{
	var type = req.cookies.type;
  var user = req.cookies.user;

  if(type == 'doctor')
  {
    Doctor.findById(user)
	.then((doc)=>{
		 res.render('dashboard',{doctor:doc});
	})
}
else
  {
    res.redirect('/');
  } 
   
})

dr_dashboardRouter.route('/update')

.get((req,res,next)=>{
    var type = req.cookies.type;
  var user = req.cookies.user;

  if(type == 'doctor')
  {
    Doctor.findById(user)
	.then((doc)=>{
		console.log(doc.email);
		 res.render('update',{doctor:doc});
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

  if(type == 'doctor')
  {
	Doctor.updateOne({_id: user}, {$set:{email: req.body.email,
		state:req.body.state,
		mobile:req.body.mobile,
		 Hospital_name:req.body.Hname,
      district:req.body.district,
      city:req.body.city

	}}, function (err,result) {
    if (err){
        console.log(err)
    }else{
        console.log(result); 
        res.send(req.body.email);
    }
})
	}
   else
  {
    res.redirect('/');
  } 

})

dr_dashboardRouter.route('/fileupload')
.get((req,res,next)=>{

  var type = req.cookies.type;
  var user = req.cookies.user;

  if(type == 'doctor')
  {
    Doctor.findById(user)
	.then((doc)=>{
		console.log(doc.email);
		 res.render('fileupload',{doctor:doc});
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

  if(type == 'doctor')
  {
	if(req.files)
  {

      Doctor.findById(user)
    .then((doc)=>{
      var ob={
                data: new Buffer(req.files.deg.data,'base64'),
                contentType: req.files.deg.name.split('.').pop()
             }
             doc.Certificates.push(ob);
             Doctor.updateOne({_id: user},{$set:{Certificates:doc.Certificates}},
              function (err,result) {
              if (err){
                  console.log(err)
              }else{
                  console.log(result); 
                  res.send("successfully");
              }
        })
      })
    }
    else
    {
      console.log("cannot") 
    }
  }
  else
  {
    res.redirect('/');
  }

})

dr_dashboardRouter.route('/at')
.get((req,res,next)=>{
  var type = req.cookies.type;
  var user = req.cookies.user;

  if(type == 'doctor')
  {
    Doctor.findById(user)
  .then((doc)=>{
    console.log(doc.acct_apt);
    res.render("appoint_sched",{apt:doc.acct_apt})

  })
}
else
  {
    res.redirect('/');
  }

})

.post((req,res,next)=>{
  var user = req.cookies.user;
  console.log(req.body.close)
    Doctor.update(
         { _id:  user}, 
         { "$pull": { 
                   "acct_apt": {"meet_url" : req.body.close}
                 }
         },function(err, result){
      if(err){
           //err
      }else if(!result){
           //update not success
           console.log("no success")
      }else{
           console.log(result)
           console.log("success")
      }
  });
    res.redirect("/dashboard");
})

dr_dashboardRouter.route('/appoint')
.get((req,res,next)=>{
  var type = req.cookies.type;
  var user = req.cookies.user;

  if(type == 'doctor')
  {
    Doctor.findById(user)
  .then((doc)=>{
    //console.log(doc.appointments);
    res.render("appointlist_dr",{apt:doc.appointments})

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
    var comment = req.body.comment;
    var submitType = req.body.submit.split('$')[0];
    var curEmail =  req.body.submit.split('$')[2];
    var url = req.body.submit.split('$')[4];
    var time= req.body.time
    var name=req.body.submit.split('$')[1];
    var date=req.body.submit.split('$')[3];
    console.log(url)
    if(type == 'doctor')
  { 
    if( submitType === "accept")
    {
           Doctor.updateOne(
         { _id:  user}, 
         { $push: { 
                   acct_apt: {
                      date:date,
                      name:name,
                      email:curEmail,
                      meet_url:url
                     }  
                 } 
         })
        .then((doc) => {
            //res.statusCode = 200;
            //res.setHeader("Content-Type" , 'application/json');
            //res.json(obj);
            Doctor.update(
         { _id:  user}, 
         { "$pull": { 
                   "appointments": {"email" : curEmail}
                 }
         },function(err, result){
      if(err){
           //err
      }else if(!result){
           //update not success
           console.log("no success")
      }else{
           console.log(result)
           console.log("success")
      }
  });
        }), (err) => next(err)
        .catch((err) => next(err));

                    var mailOptions = {
                        from: process.env.EMAIL,
                        to: curEmail,
                        subject: 'Sending Email using Node.js',
                        text: comment+"meet_url :"+url
                    };
                
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    res.send(`email is sent to ${curEmail}`);
                });
    }
    else
    {
      console.log(user)
      Doctor.update(
         { _id:  user}, 
         { "$pull": { 
                   "appointments": {"email" : curEmail}
                 }
         },function(err, result){
      if(err){
           //err
      }else if(!result){
           //update not success
           console.log("no success")
      }else{
           console.log(result)
           console.log("success")
      }
  });
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
                    res.send(`email is sent to ${curEmail}`);
                });
              res.send("dont know")
      }
    }
    else
      {
    res.redirect('/');
  }

})
dr_dashboardRouter.route('/search')

.post((req,res,next)=>{
  var type = req.cookies.type;
  var user = req.cookies.user;
  if(type == 'doctor')
  {
    Patient.findOne({ aadhar : req.body.aadhar })
    .then((doc)=>{
      
      if(doc == null)
      {
         alert("No such patient");
        res.redirect("/dashboard");
      }
      else
      {
          const url =   doc._id.toString();

          const str = doc.image.data.toString('base64');

          var img = {
              contentType: doc.image.contentType,
              data : str
          }
          res.redirect(`/dashboard/search/${doc._id}`);
      }
    })
  }
  else
  {
    res.redirect(`/`);
  }
 
})

dr_dashboardRouter.route('/report/:pt/:rt')

.get((req,res,next)=>{

  var type = req.cookies.type;
  var user = req.cookies.user;
  if(type == 'doctor')
  {
      Patient.findById(req.params.pt)
    .then((doc)=>{
     
          res.render("record" , {records : doc.files[req.params.rt]});
          // res.redirect(`/dashboard/search/${doc._id}`);
   } )  
  }
  else
  {
    res.redirect(`/`);
  }
})

dr_dashboardRouter.route('/search/:patID')

.get((req,res,next)=>{

  var type = req.cookies.type;
  var user = req.cookies.user;
  if(type == 'doctor')
  {
    Patient.findById(req.params.patID)
    .then((doc)=>{
      
      if(doc == null)
      {
        res.send("No such Patient");
      }
      else
      {
          res.render("patientInfo" , {patient : doc});
          // res.redirect(`/dashboard/search/${doc._id}`);
      }
    })
  }
  else
  {
    res.redirect(`/`);
  }
}) 

.post((req,res,next)=>{
     var type = req.cookies.type;
  var user = req.cookies.user;
  console.log(req.files)
  if(type == 'doctor')
  {
    if(req.body.dis){
            Doctor.findById(req.cookies.user)
            .then((doctor)=>{

              var newFile =  
              {
                drName : doctor.name,
                desease : req.body.dis,
                treatment : []
              }
              Patient.findById(req.params.patID)
              .then((patient)=>{
                patient.files.push(newFile);
                Patient.findByIdAndUpdate(req.params.patID , {
                  files : patient.files
                })
                .then((doc)=>{
                  res.send("File added to patient " + req.params.patID);
                } , (err)=>{
                  res.send("ERROR!!!");
                })
                .catch((err)=>{
                  res.send("ERROR!!!2.0");
                })
              })
            })
            .catch((err)=>{
              res.send("No such Doctor");
            })
    }
    else
    {
            
             Doctor.findById(req.cookies.user)
            .then((doctor)=>{

                  var image;
                  console.log(req.body)
                  if(req.files)
                  {
                    image={
                       data: req.files.record.data,
                       contentType: req.files.record.name.split('.').pop()
                      }
                  }
                  console.log(req.body.dise)
              Patient.updateOne(
                            { _id :req.params.patID ,
                              "files" :{
                                "$elemMatch":{"drName":doctor.name , "desease":req.body.dise}
                              }
                          },
                          {
                              "$push" :{
                                    "files.$.treatment":{
                                       "prescription":req.body.comment,
                                       "record":image
                                      }

                              }
                          },{ upsert: true, new: true },
                          function(err, result){
                              if(err){
                                   console.log(err)
                              }else if(!result){
                                   //update not success
                                   console.log("no success")
                              }else{
                                   console.log(result)
                                   console.log("success")

                              }
                          }


                )
                 
              res.send("success")
    })

    }
  }

  else
  {
    res.redirect('/');
  }
})
















module.exports = dr_dashboardRouter;