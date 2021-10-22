const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    GOOGLE_ID   : {type:String,required:true,default:null},
    USERNAME    : {type:String,required:true},
    EMAIL       : {type:String,required:true},
    PROFILE_IMG : {type:String,required:false,default:"/img/asset/profile/default.jpg"},
    CREATED_AT  : {type:Date,required:false},
    UPDATED_AT  : {type:Date,required:false},
    DELETED_AT  : {type:Date,required:false}
});

module.exports = mongoose.model('admin',AdminSchema,'admin');