var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto'); //암호화
var session = require("express-session");
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');

var routes = require('./routes/index');
var users = require('./routes/users');
var sign_up = require('./routes/sign_up');
var login = require('./routes/login');
var book_mark_create = require('./routes/Book_mark_create');
var book_mark_hot_list = require('./routes/Book_mark_hot_list');
var book_mark_read = require('./routes/Book_mark_read');
var imageRouter = require('./routes/imageRouter');
var book_mark_my_list = require('./routes/Book_mark_my_list');
var book_mark_read_favorite = require('./routes/Book_mark_read_favorite');
var User = require('./user');
var fbConfig = require('./fbConfig');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);
app.use('/sign_up',sign_up);
app.use('/login',login);
app.use('/create',book_mark_create);
app.use('/hot_list',book_mark_hot_list);
app.use('/read',book_mark_read);
app.use('/images',imageRouter);
app.use('/my_list',book_mark_my_list);
app.use('/read_favorite',book_mark_read_favorite);


passport.use('facebook-token', new FacebookTokenStrategy(
   {
      clientID: fbConfig.clientID,
      clientSecret: fbConfig.clientSecret,
      profileFields: ['id', 'displayName', 'photos', 'email'],
   },
   function (accessToken, refreshToken, profile, done) {
      console.log('accessToken : ' + accessToken + " refreshToken : " + refreshToken);
      console.log("profile : ", profile);
      // 사용자 찾거나, 신규 등록    
      User.findOrCreate(profile, accessToken, function (err, user) {
         return done(err, user);
      });
   }
   ));

// 세션에 쓰기
passport.serializeUser(function (user, done) {
   console.log('serializeUser - user.id : ', user.id);
   done(null, user.id);
});

// 세션에 기록된 정보 얻기
passport.deserializeUser(function (id, done) {
   var user = User.findOne(id);
   console.log('deserializeUser', id, user);
   done(null, user);
});

app.post('/auth/facebook/token', function (req, res, next) {
   passport.authenticate('facebook-token', function (err, user, msg, status) {
      if (err) {
         return next(err);
      }
      
      console.log('user : ', user, ' msg : ', msg, ' status : ', status);
      req.logIn(user, function(err) {
         if ( err ) {
            console.error('Error', err);
         }
         res.status(200).send('Done');
      });
   })(req);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports.hash = function(key){
  var hash = crypto.createHash('sha1');
  hash.update(key);
  return hash.digest('hex');
};
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;