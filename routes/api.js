const express           = require('express');
const csrf              = require('csurf');
const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const app               = express.Router();
const adminController   = require('../controller/adminController');
const userController    = require('../controller/userController');
const logController     = require('../controller/logs-controller');
const dailyMessageController = require('../controller/daily-message-controller');
const {PassportLocalAuthenticate}    = require('../controller/authenticationController');
const passport          = require('passport');
const Logs              = require('../models/Logs');
//SETUP ROUTES MIDDLEWARE
var csrfProtection = csrf({ cookie: true });
//PARSE COOKIES
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
    Description : Admin Sign In
    Route       : POST /api/admin/sign-in
*/
app.post('/admin/sign-in',csrfProtection,(req,res,next)=>{
    adminController.FindAdmin({
        username    : req.body.username,
        password    : req.body.password,
        request     : req.body.request
    },(result)=>{
        res.send(result);
    });
});
/*
    Description : Admin Sign Up
    Route       : POST /api/admin/sign-up
*/
app.post('/admin/sign-up',csrfProtection,(req,res,next)=>{
    adminController.CreateAdmin({
        username: req.body.username,
        email   : req.body.email,
        password: req.body.password
    },(result)=>{
        res.send({csrfToken:req.csrfToken(),result :result});
    })
});


/*
    Description : Update Users Info / Create Users Info
    Route       : POST /api/processUsers
*/
app.post('/processUsers',(req,res,next)=>{
    userController.FindUsers({
        admin_document  : req.body.admin_document,
        username        : req.body.username,
        old_username    : req.body.old_username,
        user_document   : req.body.user_document,
        request         : req.body.request
    },(FindUsersResult)=>{
        if(FindUsersResult.status_code == 404){
            userController.CreateUsers({
                fullname      : req.body.fullname,
                username      : req.body.username,
                password      : req.body.password,
                birthdate     : req.body.birthdate,
                admin_document: req.body.admin_document,
                is_firework   : req.body.is_firework,
                is_password   : req.body.is_password,
                before        : req.body.title_before,
                on            : req.body.title_on
            },(CreateUserResult)=>{
                res.send(CreateUserResult);
            })
        }
        if(FindUsersResult.status_code == 200){
            userController.UpdateUsers({
                fullname      : req.body.fullname,
                username      : req.body.username,
                old_username  : req.body.old_username,
                password      : req.body.password,
                birthdate     : req.body.birthdate,
                admin_document: req.body.admin_document,
                is_firework   : req.body.is_firework,
                is_password   : req.body.is_password,
                before        : req.body.title_before,
                on            : req.body.title_on,
                update_request: req.body.update_request
            },(UpdateUserResult)=>{
                res.send(UpdateUserResult);
            });
        }
    });
});
/*
    Description : Fetch Users Data
    Route       : POST /api/fetchUsers
*/
app.post('/fetchUsers',(req,res,next)=>{
    userController.FindUsers({
        admin_document  : req.body.admin_document,
        username        : req.body.username,
        user_document   : req.body.user_document,
        request         : req.body.request
    },(result)=>{
        res.send(result);
    });
});
 

/*
    Description : Add Daily Message / Update Daily Message / Delete Daily Message
    Route       : POST /api/processDailyMessage
*/
app.post('/processDailyMessage',(req,res,next)=>{
    if(req.body.method == 'add'){
        dailyMessageController.CreateDailyMessage({
            admin_document : req.body.admin_document,
            message_header : req.body.message_header,
            is_weekend     : req.body.is_weekend,
            time_interval  : req.body.time_interval,
            user_document  : req.body.user_document
        },(result)=>{
            res.send(result);
        });
    }else{
        dailyMessageController.UpdateDailyMessage({
            admin_document      : req.body.admin_document,
            message_header      : req.body.message_header,
            is_weekend          : req.body.is_weekend,
            time_interval       : req.body.time_interval,
            user_document       : req.body.user_document,
            document_document   : req.body.document_document
        },(result)=>{
            // res.send({result:result,method:"update"});
            res.send(result);
        });
    }
});
/*
    Description : Fetch Daily Message Data (Active)
    Route       : POST /api/fetchDailyMessage
*/
app.post('/fetchDailyMessage',(req,res,next)=>{
    dailyMessageController.FindDailyMessage({
        admin_document      : req.body.admin_document,
        user_document       : req.body.user_document,
        document_document   : req.body.document_document
    },(result)=>{
        res.send(result);
    });
});
/*
    Description : Fetch Daily Message Data (Active)
    Route       : POST /api/fetchDailyMessage
*/
app.post('/deleteDailyMessage',(req,res,next)=>{
    dailyMessageController.DeleteDailyMessage({
        admin_document      : req.body.admin_document,
        document_document   : req.body.document_document
    },(result)=>{
        res.send(result);
    });
});

/*
    Description : Add Firework Setting / Update Firework Setting
    Route       : POST /api/processFireworkSetting
*/
app.post('/processFireworkSetting',(req,res,next)=>{
    res.send({status_code:"200",status_desc:"OK"});
});
/*
    Description : Fetch Firework Setting
    Route       : POST /api/fetchFireworkSetting
*/
app.post('/fetchFireworkSetting',csrfProtection,(req,res,next)=>{
    res.send({status_code:"200",status_desc:"OK"});
});

/*
    Description : Fetch Logs
    Route       : POST /api/fetchLogs
*/
app.post('/fetchLogs',csrfProtection,(req,res,next)=>{
    logController.FindLogs({
        admin_document : req.body.admin_document
    },(result)=>{
        res.send(result);
    })
});

app.post('/userVerification',(req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            return res.redirect('/u/' + req.body.username);
        }
        if (!user) { 
            return res.redirect('/u/' + req.body.username); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return res.redirect('/u/' + req.body.username); 
            }
            Logs.findOne({logs_session_id:req.session.id},(err,logs)=>{
                if(err){
                    return res.redirect('/u/' + req.body.username);
                }
                if(logs == null){
                    let data = {
                        user_id         : user._id,
                        admin_id        : user.admin_id,
                        os_info         : `OS Name : ${req.device.os.name} Version : ${req.device.os.version}`,
                        browser_info    : `Browser Name : ${req.device.client.name}`,
                        device_info     : `Type : ${req.device.device.type} Brand : ${req.device.device.brand} Model : ${req.device.device.model}`,
                        counter         :  0,
                        logs_session_id : req.session.id
                    };
                    Logs.create(data,(error,data)=>{
                        if(error){
                            return res.redirect('/u/' + req.body.username);
                        }
                        if(!req.session.views){
                            req.session.views = 0;
                        }
                        return res.redirect('/u/' + req.body.username);
                    });
                }else{
                    logs.counter = logs.counter + 1;
                    if(!req.session.views){
                        req.session.views = logs.counter
                    }
                    logs.save((error,save_result)=>{
                        if(error){
                            return res.redirect('/u/' + req.body.username);
                        }
                        return res.redirect('/u/' + req.body.username);
                    });
                }
            });
        });
    })(req, res, next);
});

module.exports = app;