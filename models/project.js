const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    PROJECT_NAME    : {type:String,required:true},
    PROJECT_DESC    : {type:String,required:false},
    PROJECT_DATE    : {type:String,required:true},
    HAS_PASSWORD    : {type:Boolean,required:false},
    PASSWORD        : {type:String,required:false},
    COUNTDOWN_TITLE : {type:mongoose.Schema.Types.Mixed,required:true},
    FK_ADMIN_ID     : {type:mongoose.Schema.Types.ObjectId,required:true,ref:"admin"},
    PROJECT_STYLE   : {type:mongoose.Schema.Types.ObjectId,required:true,ref:"projectstyle"},
    CREATED_AT      : {type:Date,required:false},
    UPDATED_AT      : {type:Date,required:false},
    DELETED_AT      : {type:Date,required:false}
});

module.exports = mongoose.model('project',ProjectSchema,'project'); 