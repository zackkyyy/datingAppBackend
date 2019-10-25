var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
// var admin = require ("firebase-admin")
let dotev =require('dotenv')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var relationsRouter = require('./routes/relations');
var app = express();
const session = require('express-session');

require('dotenv').config()

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  name: 'serversessionforassign2',
  secret: 'thisisasecret',
  saveUninitialized: false,   //created and not modified sessions
  resave: false,              //if the request has no changes on the session
  cookie: {
    secure : false,
    maxAge : 1000 * 60 * 60 * 1,
    httpOnly: true        //http only so the clinet script cannot mess with it
  }

}))

app.use(function (req, res, next) {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  if (req.session.loggedin) {
    res.locals.loggedin = req.session.loggedin
  }
  next()
})
app.use(function (req, res, next) {
  res.locals.session = req.session
  next()
})
// cross Origin problem to access routes from any domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/relations', relationsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Page not found');
});

module.exports = app;
