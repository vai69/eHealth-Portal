var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var objectId= require('mongodb').ObjectId;
var nodemailer = require('nodemailer');

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



const dr_dashboardRouter = express.Router();
dr_dashboardRouter.use(bodyParser.json())

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
    //console.log(doc.appointments);
    res.render("appoint_sched",{apt:doc.acct_apt})

  })
}
else
  {
    res.redirect('/');
  }

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
    var url = req.body.submit.split('$')[4]
    var time= req.body.time
    var name=req.body.submit.split('$')[1];
    var date=req.body.submit.split('$')[3]
     res.send(curEmail);
    if(type == 'doctor')
  { 
    if( submitType === "accept")
    {
       console.log(user);
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
      Doctor.updateOne(
         { _id:  user}, 
         { $pull: { 
                   appointments: {email:curEmail}
                 }
         })
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
      }
    }
    else
      {
    res.redirect('/');
  }

})
dr_dashboardRouter.route('/search')

.get((req,res,next)=>{
  var type = req.cookies.type;
  var user = req.cookies.user;
  if(type == 'doctor')
  {
    res.render('search');
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
    Patient.findOne({ aadhar : req.body.aadhar })
    .then((doc)=>{
      
      if(doc == null)
      {
        res.send("No such Patient");
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



dr_dashboardRouter.route('/search/:patID/file')
.get((req,res,next)=>{
  var type = req.cookies.type;
  var user = req.cookies.user;
  if(type == 'doctor')
  {
    
    Doctor.findById(req.cookies.user)
    .then((doctor)=>{

      var newFile =  
      {
        drName : doctor.name,
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
    res.redirect('/');
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
          const url =   doc._id.toString();

          const str = doc.image.data.toString('base64');

          var img = {
              contentType: doc.image.contentType,
              data : str
          }
          res.render("patientInfo" , {patient : doc , image : img });
          // res.redirect(`/dashboard/search/${doc._id}`);
      }
    })
  }
  else
  {
    res.redirect(`/`);
  }
}) 
















module.exports = dr_dashboardRouter;