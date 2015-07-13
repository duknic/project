var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/gamedb');

var routes = require('./routes/index');
var users = require('./routes/users');
var levels = require('./routes/levels');

var app = express();

// authentication
var stormpath = require('express-stormpath');

var userData;
// this is a href, need to do GET to pull JSON from here
var userCustomData;

app.use(stormpath.init(app, {
    postLoginHandler: function (account, req, res, next) {
        userData = account;
        console.log(account.givenName);
        userCustomData = account.customData;
        next();
    },
    apiKeyId: '5AL8GJ47LK6CH9DMXKZYYSLIY',
    apiKeySecret: 'hlizmFCKK1kg+F6aWK9orkV5xlHX7zCHfmwnoiLRhts',
    application: 'https://api.stormpath.com/v1/applications/49OK2eLCja2aZpbQaaOxYo',
    secretKey: 'mysecretkey',
    expandCustomData: true,
}));

// make db accessible to router
app.use(function (req, res, next) {
    req.userData = userData;
    req.userCustomData = userCustomData;
    req.stormpath = stormpath;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// make db accessible to router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/levels', levels);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
});


module.exports = app;
