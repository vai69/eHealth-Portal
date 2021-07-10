var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patientRouter = require('./routes/patientRouter');
var adminRouter = require('./routes/adminRouter');
var app = express();



// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));


// Set view engine as EJS
app.set('views', 'views');
app.set('view engine', 'ejs');



// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





// Database connectivity

var mongoose = require('mongoose');
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
app.use('/patient' , patientRouter );
app.use('/admin' , adminRouter);



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
