var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const session = require('express-session')
const uuidv1 = require('uuid/v1')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// views' globals
const access = require('./models/access')
access.avatars().then(data => {
  app.locals.AVATARS = data
  app.locals.JSON_AVATARS = JSON.stringify(data)
  return access.cards()
}).then(data => {
  app.locals.JSON_CARDS = JSON.stringify(data)
}).catch(error => {
  console.log(error)
})


// view engine setup
const exphbs = require('express-handlebars')
//app.engine('.hbs', exphbs({extname: '.hbs'}))
app.engine('.hbs', exphbs({defaultLayout: 'main',
              partialsDir: 'views/partials/'}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  genid: function(req) {
    return uuidv1()
  },
  secret: 'super problem solver',
  resave: true,
  saveUninitialized: false,
  expire: 2*3600*1000,
  cookie: {path: '/', maxAge: 2*3600*1000}
}))

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
