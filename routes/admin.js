const express       = require('express');
const csrf          = require('csurf');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const app           = express.Router();
const {AdminEnsureAuthentication,AdminEnsureGuest} = require('../controller/authenticationController');
//SETUP ROUTES MIDDLEWARE
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
//PARSE COOKIES
app.use(cookieParser());
app.use(bodyParser.json());

/*
    Description : Dashboard - Sign In
    Route       : GET /Dashboard/sign-in
*/
app.get('/Dashboard/sign-in',csrfProtection,AdminEnsureGuest,(req,res,next)=>{
    res.render('./admin/admin-dashboard-sign-in',{csrfToken:req.csrfToken()});
});
/*
    Description : Dashboard - Sign Up
    Route       : GET /Dashboard/sign-in
*/
app.get('/Dashboard/sign-up',csrfProtection,AdminEnsureGuest,(req,res,next)=>{
    res.render('./admin/admin-dashboard-sign-up',{csrfToken:req.csrfToken()});
});
/*
    Description : Dashboard - Home/Users
    Route       : GET /Dashboard/users
*/
app.get('/Dashboard/users',csrfProtection,AdminEnsureAuthentication,(req,res,next)=>{
    res.render('./admin/admin-dashboard-users',{csrfToken:req.csrfToken(),admin_document:req.user._id});
});
/*
    Description : Dashboard - Daily Messages
    Route       : GET /Dashboard/daily-message
*/
app.get('/Dashboard/daily-message',csrfProtection,AdminEnsureAuthentication,(req,res,next)=>{
    res.render('./admin/admin-dashboard-daily-message',{csrfToken:req.csrfToken(),admin_document:req.user._id});
});
/*
    Description : Dashboard - Visited Logs
    Route       : GET /Dashboard/visited-logs
*/
app.get('/Dashboard/visited-logs',csrfProtection,AdminEnsureAuthentication,(req,res,next)=>{
    res.render('./admin/admin-dashboard-logs',{csrfToken:req.csrfToken(),admin_document:req.user._id});
});
/*
    Description : Dashboard - Firework Settings
    Route       : GET /Dashboard/firework-setting
*/
app.get('/Dashboard/firework-setting',csrfProtection,AdminEnsureAuthentication,(req,res,next)=>{
    res.render('./admin/admin-dashboard-firework-setting',{csrfToken:req.csrfToken(),admin_document:req.user._id});
});
/*
    Description : Dashboard - Message Settings
    Route       : GET /Dashboard/message-setting
*/
app.get('/Dashboard/message-setting',csrfProtection,AdminEnsureAuthentication,(req,res,next)=>{
    res.render('./admin/admin-dashboard-message-setting',{csrfToken:req.csrfToken(),admin_document:req.user._id});
});
/*
    Description : Dashboard - Frequently Asked Question
    Route       : GET /Dashboard/daily-message
*/
app.get('/Dashboard/frequently-asked-question',csrfProtection,AdminEnsureAuthentication,(req,res,next)=>{
    res.render('./admin/admin-dashboard-faq',{csrfToken:req.csrfToken(),admin_document:req.user._id});
});
/*
    Description : Dashboard - Log Out
    Route       : GET /Dashboard/log-out
*/
app.get('/Dashboard/log-out',AdminEnsureAuthentication,(req,res,next)=>{
    req.session.destroy((error)=>{
        req.logOut();
        res.redirect('/a/Dashboard/sign-in');
    });
});
module.exports = app;