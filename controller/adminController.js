const mongoose      = require('mongoose');
const AdminSchema   = require('../models/Admin');
const bcrypt        = require('bcrypt');
const {GenerateCallbacks,ValidateParams}   = require('../controller/handlebarHelpers');

async function CreateAdmin(data,callback){
    let findQuery = {$or:[{username:data.username},{email:data.email}]};

    AdminSchema.count(findQuery,(error,result)=>{
        if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}

        if(result > 0){
            return callback(GenerateCallbacks(409,"Error",`There already a username ${data.username} registered!`,{}));
        }else{
            bcrypt.genSalt(10,(error,salt)=>{
                if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}

                bcrypt.hash(data.password,salt,(error,hashedPassword)=>{
                    if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}

                    AdminSchema.create({
                        username    : data.username,
                        password    : hashedPassword,
                        email       : data.email,
                        login_method: 1
                    },(error,result)=>{
                        if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
                        return callback(GenerateCallbacks(200,"OK","",result));
                    });
                });
            });
            
        }
    });
}

async function FindAdmin(data,callback){
    let findQuery = {$or:[{username:data.username},{email:data.username}]};
    if(data.request == "login"){
        findQuery = {$or:[{username:data.username},{email:data.username}],login_method:1};
    }

    AdminSchema.findOne(findQuery,(error,result)=>{
        if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
        if(result == null){return callback(GenerateCallbacks(404,"Error","Not Found",{}))};

        if(data.request == "login"){
            bcrypt.compare(data.password,result.password,(error,success)=>{
                if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
                if(success == false){return callback(GenerateCallbacks(401,"Error","Invalid Credentials!",{}));}
                return callback(GenerateCallbacks(200,"OK","",result));
            });
        }else if(data.request == "fetch"){
            return callback(GenerateCallbacks(200,"OK","",result));
        }else{return callback(GenerateCallbacks(400,"Error",error,{}));}
    });
}

async function UpdateAdmin(data,callback){
    let findQuery = {$or:[{username:data.username},{email:data.email},{_id : data.admin_document}]};

    AdminSchema.findOne(findQuery,(error,result)=>{
        if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
        
        AdminSchema.count({$or:[{username:data.username},{email:data.email}],_id : { $ne : data.admin_document}},(error,count)=>{
            if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
            if(count > 0){return callback(GenerateCallbacks(409,"Error",`There already a username ${data.username} registered!`,{}));}

            bcrypt.genSalt(10,(error,salt)=>{
                if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
    
                bcrypt.hash(data.password,salt,(error,hashedPassword)=>{
                    if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
                    result.username = data.username;
                    result.password = hashedPassword;
                    result.email    = data.email;
                    result.save((error,result)=>{
                        if(error){return callback(GenerateCallbacks(400,"Error",error,{}));}
                        return callback(GenerateCallbacks(200,"OK","",result));
                    });
                });
            });
        });
    });
}

module.exports = {
    CreateAdmin,
    FindAdmin,
    UpdateAdmin
}