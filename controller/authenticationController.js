const passport = require('passport');

module.exports = {
    AdminEnsureAuthentication : (req,res,next)=>{
        if(req.user && req.user.google_id && req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/a/Dashboard/sign-in');
        }
    },
    AdminEnsureGuest : (req,res,next)=>{
        if(req.user && req.user.google_id && req.isAuthenticated()){
            res.redirect('/a/Dashboard/users');
        }else{
            return next();
        }
    },
    UserEnsureAuthentication : (req,res,next)=>{
        if(req.user && req.user.google_id && req.isAuthenticated()){
            res.redirect('/a/Dashboard/users');
        }else{
            return next();
        }
    },
    PassportLocalAuthenticate : (req,res,next)=>{
        passport.authenticate('local', function(err, user, info) {
            if(err){return next(err);}
            req.login(user, next);
          })(req, res, next);
    }
}