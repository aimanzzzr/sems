const express       = require('express');
const csrf          = require('csurf');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const app           = express.Router();

//SETUP ROUTES MIDDLEWARE
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
//PARSE COOKIES
app.use(cookieParser());
app.use(bodyParser.json());

/*
    Description : Introduction / Landing Page
    Route       : GET /
*/
app.get('/',csrfProtection,(req,res,next)=>{
    res.render('introduction-page',{csrfToken:req.csrfToken()});
});
/*
    Description : Error / 404-page
    Route       : GET /error
*/
app.get('/error',csrfProtection,(req,res,next)=>{
    res.render('404-page',{csrfToken:req.csrfToken()});
});

module.exports = app;