var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Degrees = new Schema({
        data: Buffer,
        contentType: String
});


var doctorSchema = new Schema({
    doc_no:{
        type:Number,
    },
    username:{
        type : String,
        requried : true,
        unique : true
    },
    password:{
        type : String,
        requried : true,
        unique : true
    },
    DOB : {
        type:Date ,
         required : true
    }
    ,

    name : {
        type : String,
        requried : true
    },
    email:{
        type : String,
        requried : true
    },
    mobile:{
        type : Number,
        required : true,
        unique : true
    },
    Specialization:{
        type : String,
        requried : true
    },
    state:{
        type : String,
        requried : true
    },
    district:{
        type : String,
        requried : true
    },
    city:{
        type : String,
        requried : true
    },
    Hospital_name:{
        type : String,
        requried : true
    },
    aadhar : {
        type : String,
        requried : true,
        unique : true
    },
    Id_proof: {
        data: Buffer,
        contentType: String
    },
    Certificates:[Degrees]
},{
    timestamps : true
});


var Doctor = mongoose.model('doctor' , doctorSchema);


module.exports = Doctor;