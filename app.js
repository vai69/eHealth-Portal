var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv/config');
var mongoose = require('mongoose');
var expressFileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var ejs = require('ejs');
 



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var patientRouter = require('./routes/patientRouter');
var adminRouter = require('./routes/adminRouter');
var app = express();



// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));


// Set view engine as EJS
app.set('views', 'views');
app.set('view engine', 'ejs');




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



// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(expressFileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





// Database connectivity


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



var Patient = require("./models/patient");
var PatientQueue = require('./models/patientqueue');




var connect = mongoose.connect('mongodb://localhost:27017/eHealth')
.then((db)=>{
  console.log("Database Connected Successfully");
})
.catch((err)=>{
  var err = new Error("Error in Database connectivity") ;
  return next(err);
})




// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/patient' , patientRouter );
app.use('/admin' , adminRouter);








app.get( '/patient' , (req,res,next)=>{
  res.sendFile( __dirname + "/public/patient.html");
})

app.post('/patient' , (req,res,next)=>{


  console.log(req.files);
  var pat = new PatientQueue();


  pat.username = req.body.username;
  pat.DOB = req.body.DOB; 
  pat.name = req.body.name;
  pat.email = req.body.email;
  pat.mobile = req.body.mobile;
  pat.bloodGr = req.body.bloodGr ;
  pat.state = req.body.state;
  pat.district = req.body.district;
  pat.aadhar = req.body.aadhar;
  pat.image.data = req.files.myFile.data;
  pat.image.contentType = req.files.myFile.name.split('.').pop();
  pat.nomeneeAadhar = req.body.nomeneeAadhar;

  // res.send(req.files.myFile);


  PatientQueue.create( pat )
  .then((doc)=>{
      res.statusCode = 200;
      res.setHeader("Content-Type" , 'application/json');
      res.json(doc);
  }), (err)=>next(err)
  .catch((err)=>next(err));
 
})




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
