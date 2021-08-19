var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var appointment = new Schema({
    pat_id : {
        type : String,
        unique: false
    },
    meet_url :{
        type : String,
        unique: false
    },
    date:{
        type:Date
    },
    name:
    {
        type:String
    },
    email:
    {
        type:String
    }

});

var accepted_apt = new Schema({
    meet_url :{
        type : String,
        unique: false
    },
    date:{
        type:Date
    },
    name:
    {
        type:String
    },
    email:
    {
        type:String
    },
    time:{
        type:String
    }

});

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
        type:Date 
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
        type : Number,
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
    Certificates:[Degrees],
    appointments:[appointment],
    acct_apt:[accepted_apt]
},{
    timestamps : true
});


var Doctor = mongoose.model('doctor' , doctorSchema);


module.exports = Doctor;