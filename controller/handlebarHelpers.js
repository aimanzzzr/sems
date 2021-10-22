const moment = require('moment');

module.exports = {
    formatDate  : (date,format)=>{
        return moment(date).format(format);
    },
    CheckYear   : (min_day,min_month,max_day,max_month)=>{
        let current_date = new Date();
        let current_year = current_date.getFullYear();
        let new_min_date = new Date(current_year,min_month - 1,min_day);
        let new_max_date = new Date(current_year,max_month - 1,max_day);
        let status       = null;
    
        if(current_date > new_max_date){
            new_min_date = new Date(current_year + 1,min_month - 1,min_day);
            new_max_date = new Date(current_year + 1,max_month - 1,max_day);
            status       = false;
        }else if(current_date < new_min_date){
            status       = false;
        }else if(current_date >= new_min_date && current_date <= new_max_date){
            status       = true;
        }else{
            // console.log("Something Wrong With Your Algorithm");
            return {};
        }
        return {
            min_date : new_min_date,
            max_date : new_max_date,
            status   : status
        };
    },
    GenerateCallbacks   : (statusCode,statusDesc,errorData,dataToSent)=>{
        let callbackTemplate = {
            status_code : "",
            status_desc : "",
            error       : "",
            data        : ""
        };
    
        callbackTemplate.status_code = statusCode;
        callbackTemplate.status_desc = statusDesc;
        callbackTemplate.error       = errorData;
        callbackTemplate.data        = dataToSent;
        return callbackTemplate;
    },
    ValidateParams      : (params,keyname)=>{
        let error = false;
        (!params.hasOwnProperty(keyname)) ? error = true : (params[keyname] == "" || params[keyname] == null || params[keyname].length < 5) ? error = true : error = false;        
        return error;
    }
}