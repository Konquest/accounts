var express = require('express'),
    async = require('async'),
    db = require('./db'),
    app = require('./app'),
    start;

module.exports.start = start = function(callback) {
    async.parallel([db.init, app.init], function(err) {
        if (err) {
            return console.log('Failed to start server');
        }
        console.log('\nServer ready to go');
        if (callback) callback.call(app);
    });
};

module.exports.stop = function(callback) {
    async.parallel([app.close, db.close], function(err) {
        console.log('\nServer shut down');
        if (callback) callback.call(app);
    });
};

if (require.main === module) {
    start();
}