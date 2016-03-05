var express = require('express');
var router = express.Router();
var passport = require('passport')
    ,LocalStrategy = require('passport-local').Strategy
    ,session = require('express-session')
    ,db = require('./dbConn')
    ,app = require('../app');

var local = new LocalStrategy({
    usernameField:'user_email',
    passwordField:'user_pw',
    passReqToCallback:true
    },function(req,user_email,user_pw,done){
        console.log("LocaStrategy : "+user_email+user_pw);
    var user = {'user_email' : user_email}
    return done(null,user);

});

passport.use(local);

//인증 후 사용자 정보를 Session에 저장
passport.serializeUser(function(user,done){
    console.log('serialize');
    done(null,user);
});
passport.deserializeUser(function (user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize :');
    console.log(user);
    done(null, user);
    //});
});

module.exports.isAuthenticated = function (req, res, next) {
    console.log('isAuthenticated', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next;
    } else {
        res.json("실패");
    }
}