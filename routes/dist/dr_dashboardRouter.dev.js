"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');

var objectId = require('mongodb').ObjectId;

var DoctorQueue = require('../models/doctorqueue');

var Doctor = require('../models/doctor');

var PatientQueue = require('../models/patientqueue');

var Patient = require('../models/patient');

var dr_dashboardRouter = express.Router();
dr_dashboardRouter.use(cookieParser());
dr_dashboardRouter.use(bodyParser.json());
dr_dashboardRouter.route('/').get(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    Doctor.findById(user).then(function (doc) {
      res.render('dashboard', {
        doctor: doc
      });
    });
  } else {
    res.redirect('/');
  }
});
dr_dashboardRouter.route('/search').get(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    res.render('search');
  } else {
    res.redirect('/');
  }
}).post(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    Patient.findOne({
      aadhar: req.body.aadhar
    }).then(function (doc) {
      if (doc == null) {
        res.send("No such Patient");
      } else {
        var url = doc._id.toString();

        var str = doc.image.data.toString('base64');
        var img = {
          contentType: doc.image.contentType,
          data: str
        };
        res.redirect("/dashboard/search/".concat(doc._id));
      }
    });
  } else {
    res.redirect("/");
  }
});
dr_dashboardRouter.route('/search/:patID/file').get(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    Doctor.findById(req.cookies.user).then(function (doctor) {
      var newFile = {
        drName: doctor.name,
        treatment: []
      };
      Patient.findById(req.params.patID).then(function (patient) {
        patient.files.push(newFile);
        Patient.findByIdAndUpdate(req.params.patID, {
          files: patient.files
        }).then(function (doc) {
          res.send("File added to patient " + req.params.patID);
        }, function (err) {
          res.send("ERROR!!!");
        })["catch"](function (err) {
          res.send("ERROR!!!2.0");
        });
      });
    })["catch"](function (err) {
      res.send("No such Doctor");
    });
  } else {
    res.redirect('/');
  }
});
dr_dashboardRouter.route('/search/:patID').get(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    Patient.findById(req.params.patID).then(function (doc) {
      if (doc == null) {
        res.send("No such Patient");
      } else {
        var url = doc._id.toString();

        var str = doc.image.data.toString('base64');
        var img = {
          contentType: doc.image.contentType,
          data: str
        };
        res.render("patientInfo", {
          patient: doc,
          image: img
        }); // res.redirect(`/dashboard/search/${doc._id}`);
      }
    });
  } else {
    res.redirect("/");
  }
});
dr_dashboardRouter.route('/fileupload').get(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    Doctor.findById(user).then(function (doc) {
      console.log(doc.email);
      res.render('fileupload', {
        doctor: doc
      });
    });
  } else {
    res.redirect('/');
  }
}).post(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    if (req.files) {
      Doctor.findById("60e83ba64a556a1d908703c3").then(function (doc) {
        var ob = {
          data: new Buffer(req.files.deg.data, 'base64'),
          contentType: req.files.deg.name.split('.').pop()
        };
        doc.Certificates.push(ob);
        Doctor.updateOne({
          _id: objectId("60e83ba64a556a1d908703c3")
        }, {
          $set: {
            Certificates: doc.Certificates
          }
        }, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            res.send("successfully");
          }
        });
      });
    } else {
      console.log("cannot");
    }
  } else {
    res.redirect('/');
  }
});
dr_dashboardRouter.route('/:docID').get(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    Doctor.findById(user).then(function (doc) {
      console.log(doc.email);
      res.render('update', {
        doctor: doc
      });
    });
  } else {
    res.redirect('/');
  }
}).post(function (req, res, next) {
  var type = req.cookies.type;
  var user = req.cookies.user;

  if (type == 'doctor') {
    var fl = req.files;
    Doctor.updateOne({
      _id: objectId(user)
    }, {
      $set: {
        email: req.body.email,
        state: req.body.state,
        mobile: req.body.mobile,
        Hospital_name: req.body.Hname,
        district: req.body.district,
        city: req.body.city
      }
    }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(req.body.email);
      }
    });
  } else {
    res.redirect('/');
  }
});
module.exports = dr_dashboardRouter;