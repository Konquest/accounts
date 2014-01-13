var passport = require('passport'),
    AnonymousStrategy = require('passport-anonymous').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    db = require('./db');


module.exports.setup = function() {
    // Anonymous
    passport.use(new AnonymousStrategy());

    // Password strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            db.User.findOne({active: true, username: username}, function (err, user) {
                if (err) return done(err);
                if (!user) return done(null, false);

                user.comparePassword(password, function(err, isMatch) {
                    if (err) return done(err);
                    if (!isMatch) return done(null, false);

                    return done(null, user);
                });
            });
        }
    ));

    // Client Credentials
    passport.use(new BasicStrategy(
        function (username, password, done) {
            db.Application.findById(username, function (err, application) {
                if (err) return done(err);
                if (!application) return done(null, false);
                if (application.secret !== password) return done(null, false);

                return done(null, application);
            });
        }
    ));

    // Client Credentials
    passport.use(new ClientPasswordStrategy(
        function (clientId, clientSecret, done) {
            db.Application.findById(clientId, function (err, application) {
                if (err) return done(err);
                if (!application) return done(null, false);
                if (application.secret !== clientSecret) return done(null, false);

                return done(null, application);
            });
        }
    ));

    // Code
    passport.use(new BearerStrategy(
        function (accessToken, done) {
            db.AccessToken.findOne({token: accessToken}, function (err, accessToken) {
                if (err) return done(err);
                if (!accessToken) return done(null, false);

                if (accessToken.user) {
                    db.User.findById(accessToken.user, function (err, user) {
                        if (err) return done(err);
                        if (!user) return done(null, false);

                        return done(null, user, { scope: accessToken.scope });
                    });
                } else {
                    //The request came from an application since userId is null
                    //therefore the application is passed back instead of a user
                    db.Application.findById(token.application, function (err, application) {
                        if (err) return done(err);
                        if (!application) return done(null, false);

                        return done(null, application, { scope: accessToken.scope });
                    });
                }
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        db.User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
