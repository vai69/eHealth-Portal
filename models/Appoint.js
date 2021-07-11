var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var appointment = new Schema({
	pat_id : {
        type : String,
        unique: false
    },
    doc_id : {
        type : String,
        unique: false
    },
    meet_url :{
    	type : String,
        unique: false
    },
    date:{
    	type:Date
    }

})

var Appoint = mongoose.model('Appoint' , appointment);


module.exports =Appoint;