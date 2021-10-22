const mongoose = require('mongoose');

const DailyMessageSchema = new mongoose.Schema({
    HEADER          : {type:String,required:true},
    IS_ACTIVE       : {type:Number,required:true},
    CREATED_AT      : {type:Date,required:false},
    UPDATED_AT      : {type:Date,required:false},
    DELETED_AT      : {type:Date,required:false},
    FK_PROJECT_ID   : {type:mongoose.Schema.Types.ObjectId,required:true,ref:"project"},
});

module.exports = mongoose.model('daily-message',DailyMessageSchema,'daily-message');