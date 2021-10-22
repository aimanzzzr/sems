const express       = require('express');
const csrf          = require('csurf');
const bodyParser    = require('body-parser');
// const cookieParser  = require('cookie-parser');
const Users         = require('../models/Users');
const app           = express.Router();
const CheckYear     = require('../controller/handlebarHelpers').CheckYear;
const Logs          = require('../models/Logs');
//SETUP ROUTES MIDDLEWARE
var csrfProtection = csrf({ cookie: false });
var parseForm = bodyParser.urlencoded({ extended: false });
//PARSE COOKIES
// app.use(cookieParser());
app.use(bodyParser.json());

/*
    Description : User Page -> Countdown/Countdown-verification
    Route       : GET /u/:username
*/
app.get('/:username',csrfProtection,(req,res,next)=>{
    Users.findOne({username:req.params.username},(error,user)=>{
        if(error != null){
            res.redirect('/error');
        }
        if(user != null){
            Logs.findOne({logs_session_id:req.session.id},(error,logs)=>{
                if(logs!=null){
                    logs.counter = logs.counter + 1;
                    logs.save((error,data)=>{});
                }
            });
            if(user.has_password && (req.isAuthenticated() == false || typeof req.user === 'undefined' || req.user.google_id != null)){
                res.render('./users/users-countdown-verification',{csrfToken:req.csrfToken(),page:"verification",admin_id: user.admin_id,username:req.params.username});
            }else{
                let birth_date  = String(user.birth_date);
                let birth_day   = parseInt(birth_date.substr(8,2),10);
                let birth_month = parseInt(birth_date.substr(5,2),10);
                let check_date  = CheckYear(birth_day,birth_month,birth_day + 10,birth_month);

                if(check_date.status == true){
                    res.render('./users/users-firework-page',{csrfToken:req.csrfToken(),page:"firework",admin_id: user.admin_id,user_document:user._id,username:req.params.username});
                }else{
                    res.render('./users/users-countdown-page',{csrfToken:req.csrfToken(),page:"countdown",admin_id: user.admin_id,user_document:user._id,username:req.params.username});
                }
            }
        }else{
            res.redirect('/error');
        }
    });
});

app.get('/users/log-out',(req,res,next)=>{
    let username = req.user.username;
    req.logOut();
    res.redirect('/u/' + username);
});

module.exports = app;