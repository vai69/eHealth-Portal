var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var treatmentSchema = new Schema({
    prescription:{
        type : String,
    },
    record: {
        data: Buffer, 
        contentType: String
    }

});


var FileSchema = new Schema({
    drName : {
        type : String,
        requried : true
    },
    desease :{
        type:String,
        requried:true
    },
    treatment : [treatmentSchema]

},{
    timestamps : true
});




var patientSchema = new Schema({
    pat_no:{
        type:Number
    },
    username:{
        type : String,
        requried : true,
        unique : true
    },
    DOB : {
        type:Date 
    }
    ,
     password:{
        type : String,
        requried : true,
        unique : true
    },
    name : {
        type : String,
        requried : true
    },
    email:{
        type : String,
        requried : true
    },
    mobile:{
        type : Number
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
    image: {
        data: Buffer, 
        contentType: String
    },
    nomeneeAadhar:{
        type : String,
        requried : true,
    },
    files : [FileSchema]  
},{
    timestamps : true
});



var Patient = mongoose.model('patient' , patientSchema);


module.exports = Patient;