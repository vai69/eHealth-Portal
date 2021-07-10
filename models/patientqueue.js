var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var treatmentSchema = new Schema({
    prescription:{
        type : String,
    },
    reportConclusion : {
        type : String
    }
});


var FileSchema = new Schema({
    drName : {
        type : String,
        requried : true
    },
    treatment : [treatmentSchema]

},{
    timestamps : true
});




var patientSchema = new Schema({
    username:{
        type : String,
        requried : true,
        unique : true
    },
    name : {
        type : String,
        requried : true
    },
    DOB : {
        type:Date ,
         required : true
    }
    ,
    email:{
        type : String,
        requried : true
    },
    mobile:{
        type : Number,
        required : true,
        unique : true
    },
    bloodGr : {
        type : String,
        required : true
    },
    state:{
        type : String,
        requried : true
    },
    district:{
        type : String,
        requried : true
    },
    aadhar : {
        type : String,
        requried : true,
        unique : true
    },
    nomeneeAadhar:{
        type : String,
        requried : true,
    },
    files : [FileSchema]  
},{
    timestamps : true
});



var PatientQueue = mongoose.model('patientqueue' , patientSchema);


module.exports = PatientQueue;