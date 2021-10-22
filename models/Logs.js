const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    OS_INFO         : {type:String,required:true},
    BROWSER_INFO    : {type:String,required:true},
    DEVICE_INFO     : {type:String,required:true},
    SESSION_ID      : {type:String,required:true},
    COUNTER         : {type:String,required:true},
    FK_PROJECT_ID   : {type:mongoose.Schema.Types.ObjectId,required:true,ref:"project"},
    CREATED_AT      : {type:Date,required:false},
    UPDATED_AT      : {type:Date,required:false},
    DELETED_AT      : {type:Date,required:false}
});

module.exports = mongoose.model('log',LogSchema,'logs'); 