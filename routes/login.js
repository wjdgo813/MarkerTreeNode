var express = require('express');
var router = express.Router();
var passport=require('passport');
var passportRouter = require('./passportRouter');
var flash = require('connect-flash');
var db = require('./dbConn');
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/',
    passport.authenticate('local', {
      successRedirect:'/login/success',
      failureRedirect:'/login/failure',failreFlash:true

    })
);

router.get('/success',passportRouter.isAuthenticated,function (req, res, next) {
  console.log("login::"+req.user);
  res.json({
    "success": 1,
    "result": {
      "message": "로그인 성공"
    }
  });
});

router.get('/failure', function(req, res) {
  res.json({
    "success" : 0,
    "result" : {
      "message" : "로그인 인증 실패"
    }
  });
});
/*
var login_post = function(req,res){
  res.status(200);
  db.pool.query('select user_email from tb_user where user_email= :user_email and user_pw= :user_pw',{user_email:req.user_email ,user_pw:req.user_pw},function(err,results){
    if(err!==null){
      console.log(err);
      var send = {
        success: 0,
        result: {
          message: "id가 존재하지 않습니다."
        }
      }
      res.json(send);
    }
    else{
      if(results.info.numRows >0){
        console.log("login Success!!");
        var send = {
          success: 1,
          result: {
            message: "로그인 성공"
          }
        }
        res.json(send)
      }
      else{
        console.log("failed.....8)");
        var send = {
          success: 0,
          result: {
            message: "id가 존재하지 않습니다."
          }
        }
        res.json(send);
      }
    }
  });
}

router.post('/',function(req, res, next){
  req.user_email = req.body.user_email;
  req.user_pw = req.body.user_pw;
  req.user_pw = app.hash(req.user_pw);
  next();
},login_post);*/

module.exports = router;
