var express = require('express'),
    passport = require('passport'),
    config = require('../config'),
    routes = require('./routes');

var app = express();

module.exports.config = config;    
module.exports.init = function() {
    app.configure(function() {
        app.set('port', process.env.PORT || config.port);
        app.set('views', __dirname + '/views');
        app.use(express.logger());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(passport.initialize());
        app.use(passport.session());
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

    routes.setup(app);
    
    app.listen(app.get('port'), function() {
        console.log('Application listening on port %d in %s mode', app.get('port'), app.settings.env);
    });
};

