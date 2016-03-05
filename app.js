var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto'); //암호화
var flash = require("connect-flash");
var session = require("express-session");
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var sign_up = require('./routes/sign_up');
var login = require('./routes/login');
var book_mark_create = require('./routes/Book_mark_create');
var book_mark_hot_list = require('./routes/Book_mark_hot_list');
var book_mark_read = require('./routes/Book_mark_read');
var book_mark_my_list = require('./routes/Book_mark_my_list');

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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/sign_up',sign_up);
app.use('/login',login);
app.use('/create',book_mark_create);
app.use('/hot_list',book_mark_hot_list);
app.use('/read',book_mark_read);
app.use('/my_list',book_mark_my_list);

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
