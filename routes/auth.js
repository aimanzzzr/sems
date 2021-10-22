const express = require('express');
const passport = require('passport');
const app = express.Router();
const {AdminEnsureGuest} = require('../controller/authenticationController');

/*
    Description : Authenticate with Google
    Route       : GET /auth/google
*/
app.get('/google',AdminEnsureGuest,passport.authenticate('google', { scope :['email', 'profile'] }));
/*
    Description : Google with callback
    Route       : GET /auth/google/callback
*/
app.get('/google/callback',passport.authenticate('google', { failureRedirect: '/a//Dashboard/sign-in' }), (req,res)=>{
    res.redirect('/a/Dashboard/users');
});

module.exports = app;