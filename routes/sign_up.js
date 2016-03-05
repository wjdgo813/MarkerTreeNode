var express = require('express');
var router = express.Router();
var app = require('../app');
var db = require('./dbConn');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



var sign_up_post = function(req,res){
  res.status(200);
    console.log("변경 후후후 : "+req.user_name);	
  db.pool.query('insert into TB_USER(user_email,user_pw,user_name,user_favorite,user_birth,user_gender) values(:user_email, :user_pw, :user_name, :user_favorite,' +
      ' :user_birth, :user_gender)',{user_email:req.user_email, user_pw:app.hash(req.user_pw), user_name:req.user_name, user_favorite:req.user_favorite, user_birth:req.user_birth,
       user_gender:req.user_gender},function(err,results){
    console.log(err);
    console.log(results);// 議고쉶 寃곌낵

    if(err){
      var result = {
        success: 0,
        result: {
          message: err
        }
      }
    }
    else {
      var result = {
        success: 1,
        result: {
          message: "가입 되었습니다."
        }
      }
    }
    res.json(result);

  });
}



router.post('/',function(req,res,next){

  req.user_email = req.body.user_email;
  req.user_pw = req.body.user_pw;

 req.user_name = req.body.user_name;


  console.log("변경 후후 : "+req.user_name);

  req.user_favorite = req.body.user_favorite; //null 媛??


  req.user_birth = req.body.user_birth;
  req.user_gender = req.body.user_gender;

  if(req.user_favorite == undefined){ //null??寃쎌슦 泥섎━
    req.user_favorite ="";
  }

  next();

},sign_up_post);
module.exports = router;
