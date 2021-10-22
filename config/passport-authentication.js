const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy= require('passport-google-oauth20').Strategy;
const mongoose      = require('mongoose');
const Users         = require('../models/Users');
const Admin         = require('../models/Admin');
const bcrypt        = require('bcrypt');

passport.use(new GoogleStrategy({
    clientID    : process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET, 
    callbackURL : '/auth/google/callback'
}, async function(accessToken,refreshToken,profile,done){ 
    // Use Access Token For session
    const adminData = {
        google_id   :   profile.id,
        username    :   profile.displayName,
        email       :   profile.emails[0].value,
        profile_img :   profile.photos[0].value,
        login_method:   2
    }
    
    try {
        let object = await Admin.findOne({$or:[{google_id:profile.id},{email:profile.emails[0].value}]});
        if(object){
            if(object.login_method == 1){
                object.google_id     = profile.id;
                object.login_method  = 2;
                if(object.hasOwnProperty('password')){
                    object.password  = undefined;
                }
                object.username      = profile.displayName;
                object.profile_img   = profile.photos[0].value;

                object.save((error,result)=>{
                    if(error){done(error,null);}
                    done(null,object);
                });
            }
            done(null, object);
        }else{
            await Admin.create(adminData,(error,data)=>{
                done(null,data);
            });
        }
    } catch (error){
        console.error(error);
    }
}));

passport.use(new LocalStrategy(
    (username,password,next)=>{
        Users.findOne({ username: username }, function (error, object) {
            if (error) {next(error);}
            if (!object) {
                next(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, object.password, function(err, result) {
                if(err){next(err);}
                if (result == false) {
                    next(null, false, { message: 'Incorrect password.' });
                }else{
                    next(null, object);
                }
            });
        });
    }
));

passport.serializeUser((object,next)=>{
    next(null,object.id);
});

passport.deserializeUser((object_id,next)=>{
    Users.findById(object_id,(error,user)=>{
        if(error){next(error);}
        if(user){
            next(null,user);
        }
        if(!user){
            Admin.findById(object_id,(err,admin)=>{
                if(err){next(err);}
                next(null,admin);
            });
        }
    });
    
});