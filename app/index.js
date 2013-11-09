var express = require('express'),
    passport = require('passport'),
    config = require('../config'),
    auth = require('./auth'),
    routes = require('./routes');

var SessionStore = express.session.MemoryStore;
var app = module.exports.server = express();

module.exports.init = function() {
    app.configure(function() {
        app.set('port', process.env.PORT || config.port);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.logger(config.logger || '[:date] :remote-addr ":method :url HTTP/:http-version" :status :res[content-length]b ":user-agent"'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({
            key: config.session.key,
            secret: config.session.secret,
            store: new SessionStore(),
            maxAge: config.session.age
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(function(req, res, next) {
            if (req.user) res.locals.currentUser = req.user;
            return next();
        });
        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler({ dumpExceptions: true, showMessage: true, showStack: true }));
    });

    app.configure('staging', function() {
        app.use(express.errorHandler({ dumpExceptions: true }));
    });

    app.configure('production', function() {
        app.use(express.errorHandler({ dumpExceptions: true }));
    });

    auth.setup(app);
    routes.setup(app);

    app.listen(app.get('port'), function() {
        console.log('Application listening on port %d in %s mode', app.get('port'), app.settings.env);
    });
};

