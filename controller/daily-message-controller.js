const mongoose              = require('mongoose');
const DailyMessageSchema    = require('../models/DailyMessage');
const {GenerateCallbacks,ValidateParams}   = require('../controller/handlebarHelpers');

async function CreateDailyMessage(params,callback){
    try{
        // console.log(`Validating data...`);
        if(ValidateParams(params,'admin_document')) throw new Error(`Invalid Credentials...`);

        // console.log(`Creating daily message...`);
        // console.log(params);
        DailyMessageSchema.create({
            message_header  : params.message_header,
            is_weekend      : (params.is_weekend == "") ? null : params.is_weekend,
            time_interval   : (params.time_interval == "") ? null : params.time_interval,
            admin_id        : params.admin_document,
            user_id         : params.user_document
        },(create_error,create_data)=>{
            // console.log(create_error);
            if(create_error) throw new Error(`Creating new daily message failed...`);
            FindDailyMessage({admin_document : create_data.admin_id,document_document:create_data._id},(find_data)=>{
                return callback(GenerateCallbacks(200,"OK","",find_data.data[0]));
            });
        });
    }catch(e){
        // console.log(`There is an error!..`);
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

async function FindDailyMessage(params,callback){
    try{
        let query = {};
        // console.log(`Validating data...`);
        if(ValidateParams(params,'admin_document')) throw new Error(`Invalid Credentials...`);

        // console.log(`Checking params...`);
        if(!ValidateParams(params,'document_document')){
            query = {admin_id : params.admin_document,is_active:true,_id: params.document_document};
        }else if(!ValidateParams(params,'user_document')){
            query = {admin_id : params.admin_document,is_active:true,$or:[{user_id : params.user_document}]};
        }else{
            query = {admin_id : params.admin_document,is_active:true};
            // throw new Error(`Cannot find daily message...`);
        }
        DailyMessageSchema.find(query).populate({ path: 'user_id', model: 'user', select:'_id username' }).exec((find_error,find_data)=>{
            if(find_error) throw new Error(`Cannot find daily message...`);
            return callback(GenerateCallbacks(200,"OK","",find_data));
        });
    }catch(e){
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

async function UpdateDailyMessage(params,callback){
    try {
        // console.log(`Validating data...`);
        if(ValidateParams(params,'document_document') && ValidateParams(params,'admin_document')) throw new Error(`Invalid data...`);
        // console.log(`Building query...`);
        let query = {admin_id:params.admin_document,is_active:true,_id:params.document_document};
        // console.log(`This is the query : ${query}`);

        // console.log(`Building query to be updated...`);
        let update_query = {message_header:params.message_header,is_weekend:(params.is_weekend == "") ? null : params.is_weekend,time_interval:(params.time_interval == "") ? null : params.time_interval,user_id:params.user_document};
        // console.log(`Finding data to be updated...`);
        DailyMessageSchema.findOneAndUpdate(query,update_query).populate({ path: 'user_id', model: 'user', select:'_id username' }).exec((update_error,update_data)=>{
            // console.log(update_query);
            if(update_error) throw new Error(`Failed to update data...`);
            // console.log(`Update error data: ${update_error}`);
            // console.log(update_data);
            return callback(GenerateCallbacks(200,"OK","",update_data));
        });
    }catch(e){
        // console.log(`Catch error ${e.message}`);
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

async function DeleteDailyMessage(params,callback){
    try{
        if(ValidateParams(params,'document_document') && ValidateParams(params,'admin_document')) throw new Error(`Invalid data...`);
        let query = {admin_id:params.admin_document,is_active:true,_id:params.document_document};

        DailyMessageSchema.findOneAndUpdate(query,{is_active:false},(delete_error,delete_data)=>{
            if(delete_error) throw new Error(`Failed to update data...`);
            return callback(GenerateCallbacks(200,"OK","",null));
        });
    }catch(e){
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

module.exports = {
    CreateDailyMessage,
    FindDailyMessage,
    UpdateDailyMessage,
    DeleteDailyMessage
}