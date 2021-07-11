var createError = require('http-errors');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
require('dotenv/config');
var cors= require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const request = require("request");
const multer = require("multer");
const { urlencoded } = require("body-parser");
const fileUpload = require('express-fileupload');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./roustes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: "true" }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(__dirname));

//routing
//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var doctorRouter = require('./routes/doctorRouter');
var adminRouter = require('./routes/adminRouter');
var loginRouter = require('./routes/loginRouter');
var dr_dashboardRouter = require('./routes/dr_dashboardRouter');
var pat_dashboardRouter = require('./routes/pat_dashboardRouter');
var patientRouter = require('./routes/patientRouter');
app.use('/doctor', doctorRouter);
app.use('/patient', patientRouter);
app.use('/admin', adminRouter);
app.use('/', loginRouter);
app.use('/dashboard', dr_dashboardRouter);
app.use('/pdashboard', pat_dashboardRouter);


//db connection
var connect = mongoose.connect('mongodb://localhost:27017/doctor', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((db) => {
        console.log("Database Connected Successfully");
    })
    .catch((err) => {
        var err = new Error("Error in Database connectivity");
        return next(err);
    })

//importiong models
var Doctor = require("./models/doctor");
var DoctorQueue = require('./models/doctorqueue');

app.get('/logout' , (req,res,next)=>{
    res.clearCookie('user');
    res.clearCookie('type');
    res.redirect('/');
});


module.exports = app;