const mongoose              = require('mongoose');
const LogsSchema            = require('../models/Logs');
const {GenerateCallbacks,ValidateParams}   = require('../controller/handlebarHelpers');

async function FindLogs(params,callback){
    try {
        if(ValidateParams(params,'admin_document')) throw new Error(`Invalid credentials...`);
        let query = {admin_id:params.admin_document};
        LogsSchema.find(query).populate({ path: 'user_id', model: 'user', select:'_id username' }).exec((find_error,find_data)=>{
            if(find_error || find_data == null || typeof find_data == 'undefined' || find_data == "") throw new Error(`Cannot find logs...`);
            return callback(GenerateCallbacks(200,"OK","",find_data));
        });
    }catch(e){
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

module.exports = {
    FindLogs
}