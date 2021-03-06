// Application Requirements
const path          =   require('path');
const express       =   require('express');
const mongoose      =   require('mongoose');
const dotenv        =   require('dotenv');
const passport      =   require('passport');
const session       =   require('express-session');
const MongoStore    =   require('connect-mongo');
const dbconn        =   require('./config/database');

// Initialize Express App
const app = express();
// Load Config .env File
dotenv.config({path:'./config/.env'});
// Initialize DB Connection 
dbconn();
// Initialize view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// Load Passport Config
require('./config/passport-authentication');

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize Static Folders
app.use(express.static(path.join(__dirname,'public')));

// Initialize Routes
app.use('/',require('./routes/index'));
app.use('/u',require('./routes/users'));
app.use('/auth',require('./routes/auth'))
app.use('/a',require('./routes/admin'));
app.use('/api',require('./routes/api'));

// error handler
app.use(function(err, req, res, next) {
    if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV == null){
        if(err){
            res.redirect('/error');
        }else{
            next();
        }
    }else{
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
        res.status(err.status || 500);
    }
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT,console.log(`Server is running in ${process.env.NODE_ENV ? process.env.NODE_ENV : "production" } mode on port ${PORT}`));