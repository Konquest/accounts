var express = require('express'),
    passport = require('passport'),
    flash = require('connect-flash'),
    config = require('../config'),
    auth = require('./auth'),
    routes = require('./routes'),
    app = express(),
    server;

//var SessionStore = express.session.MemoryStore;
var MongoStore = require('connect-mongo')(express);

module.exports.init = function(callback) {
    app.configure(function() {
        app.set('port', process.env.PORT || config.port);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        if (config.logger !== false) {
            app.use(express.logger(config.logger || '[:date] :remote-addr ":method :url HTTP/:http-version" :status :res[content-length]b ":user-agent"'));
        }
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({
            key: config.session.key,
            secret: config.session.secret,
            store: new MongoStore({
                url: config.db,
                auto_reconnect: true
            }),
            maxAge: config.session.age
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(function(req, res, next) {
            if (req.user) res.locals.currentUser = req.user;
            res.locals.site = config.site;

            res.locals.flash = req.flash();
            req.flashNow = function(type, msg) {
                res.locals.flash[type] = msg;
            };

            return next();
        });
        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler({ dumpExceptions: true, showMessage: true, showStack: true }));
    });

    app.configure(['staging', 'production'], function() {
        app.use(express.errorHandler({ dumpExceptions: true }));
    });

    auth.setup(app);
    routes.setup(app);

    server = app.listen(app.get('port'), function() {
        console.log('Application listening on port %d in %s mode', app.get('port'), app.settings.env);
        if (callback) callback.call(this);
    });
};

module.exports.close = function(callback) {
    server.close(callback);
};