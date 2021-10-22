const mongoose              = require('mongoose');
const UserSchema            = require('../models/Users');
const bcrypt                = require('bcrypt');
const {GenerateCallbacks,ValidateParams}   = require('../controller/handlebarHelpers');

function createUsers(params,callback){
    UserSchema.create({
        fullname        : params.fullname,
        username        : params.username,
        password        : params.hash_password,
        birth_date      : params.birthdate,
        admin_id        : params.admin_document,
        is_firework     : params.is_firework,
        has_password    : params.is_password,
        countdown_title : {before : params.before, on: params.on}
    },(create_error,created_data)=>{
        if(create_error){throw new Error(`Creating user failed...`);}
        return callback(created_data);
    });
}

async function CreateUsers(params,callback){
    try {
        if(ValidateParams(params,'username') || ValidateParams(params,'admin_document') || ValidateParams(params,'password')) throw new Error(`Invalid credentials...`);

        let query = {username:params.username,admin_id:params.admin_document,is_active:true};

        console.log(`Finding ${params.username} in admin...`);
        UserSchema.countDocuments(query,(count_error,count)=>{
            if(count_error || count > 0) throw new Error((count_error) ? `Finding username failed...` : `Duplicate ${params.username} in your account`);

            console.log(`Generating Salts...`);
            bcrypt.genSalt(10,(gen_error,salt)=>{
                if(gen_error) throw new Error(`Generating Salts Failed...`);

                console.log(`Hashing password...`);
                bcrypt.hash(params.password,salt,(hash_error,hash_password)=>{
                    if(hash_error) throw new Error(`Hashing password failed...`);

                    params.hash_password = hash_password;
                    createUsers(params,(created_data)=>{
                        return callback(GenerateCallbacks(200,"OK","",created_data));
                    });
                });
            });
        });
    }catch(e){
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

async function FindUsers (params,callback){
    //mapping for params.request
    // 1 - login
    // 2 - fetch
    try{
        let query = {};

        console.log(`Validating data...`);
        if(ValidateParams(params,'admin_document')) throw new Error(`Invalid credentials...`);

        console.log(`Generating Query...`);
        (ValidateParams(params,'username') && (!ValidateParams(params,'user_document'))) ? query = {admin_id:params.admin_document,is_active:true,_id:params.user_document} : (ValidateParams(params,'user_document') && (!ValidateParams(params,'username'))) ? query = {admin_id:params.admin_document,is_active:true,username:params.username} : query = {admin_id:params.admin_document,is_active:true};
        
        console.log(`Checking request...`);
        if(params.request != "login" && params.request != "fetch") throw new Error(`Invalid credentials...`);

        console.log(`Finding users...`);
        UserSchema.findOne(query,(find_error,find_data)=>{
            if(find_error || find_data == null || typeof find_data == 'undefined' || find_data == "") throw new Error(`Cannot find users...`);

            if(params.request == "login"){
                console.log(`Checking password...`);
                bcrypt.compare(params.password,find_data.password,(compare_error,compare_data)=>{
                    if(compare_error || compare_data == false) throw new Error(`Invalid credentials...`);
                });
            }
            return callback(GenerateCallbacks(200,"OK","",find_data));
        });
    }catch(e){
        console.log(`Catch Error ${e.message}`);
        return callback(GenerateCallbacks(400,e.name,e.message,{}));
    }
}

async function UpdateUsers (params,callback){
    //Mapping update_request
    //1 - users_info
    //2 - firework_setting
    try{
        console.log(`Validating data...`);
        if((ValidateParams(params,'username') && ValidateParams(params,'user_document')) || ValidateParams(params,'admin_document')) throw new Error(`Invalid credentials...`);

        console.log(`Building query...`);
        let query = {admin_id:params.admin_document,is_active:true,$or:[{username:params.old_username},{_id:params.user_document}]};
        console.log(`Finding documents...`);
        UserSchema.findOne(query,(find_error,find_data)=>{
            if(find_error || find_data == null || typeof find_data == 'undefined' || find_data == "") throw new Error(`Cannot find users...`);

            console.log(`Checking for request...`);
            if(params.update_request == "users_info"){
                console.log(`Changing query...`);
                query.$or.username = params.username;
                query.$or._id = undefined;
                query._id = {$ne : find_data._id};

                console.log(`Checking for existence of new username...`);
                UserSchema.countDocuments(query,(count_error,count)=>{
                    if(count_error || count > 0) throw new Error((count_error) ? `Invalid credentials...` : `There is a person named ${params.username} in your account...`);
                    find_data.fullname        = params.fullname,
                    find_data.username        = params.username,
                    find_data.birth_date      = params.birthdate,
                    find_data.is_firework     = params.is_firework,
                    find_data.has_password    = params.is_password,
                    find_data.countdown_title = {before : params.before, on: params.on}
                    
                    console.log(`Checking if password need to be updated...`);
                    if(!ValidateParams(params,'password')){
                        bcrypt.genSalt(10,(gen_error,salt)=>{
                            if(gen_error) throw new Error(`Generating salt failed...`);

                            console.log(`Hashing password...`);
                            bcrypt.hash(params.password,salt,(hash_error,hash_password)=>{
                                if(hash_error) throw new Error(`Hashing password failed...`);

                                find_data.password = hash_password;
                                find_data.save((save_error,save_data)=>{
                                    if(save_error) throw new Error(`Saving data failed...`);
                                    return callback(GenerateCallbacks(200,"OK","",save_data));
                                });
                            });
                        });
                    }
                    find_data.save((save_error,save_data)=>{
                        if(save_error) throw new Error(`Saving data failed...`);
                        return callback(GenerateCallbacks(200,"OK","",save_data));
                    });
                });
            }else if(params.update_request == "firework_setting"){
                let fireworkSetting = {
                    shell_type      : null,
                    shell_size      : null,
                    quality         : null,
                    sky_lighting    : null,
                    scale           : null,
                    finale_mode     : null,
                    auto_fire       : null,
                    is_finale_mode  : null,
                    is_sound        : null
                };

                fireworkSetting.shell_type       = params.shell_type;
                fireworkSetting.shell_size       = params.shell_size;
                fireworkSetting.quality          = params.quality;
                fireworkSetting.sky_lighting     = params.sky_lighting;
                fireworkSetting.scale            = params.scale;
                fireworkSetting.finale_mode      = params.final_mode;
                fireworkSetting.auto_fire        = params.auto_fire;
                fireworkSetting.is_finale_mode   = params.is_finale_mode;
                fireworkSetting.is_sound         = params.is_sound;
    
                find_data.firework_setting = fireworkSetting;
                find_data.save((save_error,save_data)=>{
                    if(save_error) throw new Error(`Saving data failed...`);
                    return callback(GenerateCallbacks(200,"OK","",save_data));
                });
            }else{
                throw new Error(`Invalid request...`);
            }
        });
    }catch(e){
        return callback(GenerateCallbacks(400,e.name,e.message,null));
    }
}

module.exports = {
    CreateUsers,
    FindUsers,
    UpdateUsers
}; 