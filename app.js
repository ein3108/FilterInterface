var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphps = require('express-handlebars');
var hbs = require('./helpers/handlebars')(exphps);
var lessMiddleware = require('less-middleware');
var request = require('request');
var cors = require('cors');
var fs = require('fs');
var Datastore = require('nedb');
var db = new Datastore({ filename: 'data.db', autoload: true });
var app = express();

// CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// LESS middleware
app.use(lessMiddleware(path.join(__dirname, 'public', 'stylesheets', 'less'), 
{
    preprocess: {
        // TODO: Backslash or forward slash?
        path: function(pathname, req) {
            return pathname.replace(/\\stylesheets\\css\\/, '\\');
        }
    },
    dest: path.join(__dirname, 'public'),
    force: true,
    debug: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// io exposed from bin/www
const io = require('socket.io')();
app.io = io;

var main = require('./routes/main')(io, db);
app.use('/', main);

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
