var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var appointment = new Schema({
	pat_id : {
        type : String
    },
    doc_id : {
        type : String
    },
    meet_url :{
    	type : String
    },
    date:{
    	type:Date
    }

})

var Appoint = mongoose.model('Appoint' , appointment);


module.exports =Appoint;