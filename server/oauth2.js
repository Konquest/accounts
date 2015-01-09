var oauth2orize = require('oauth2orize'),
    //passport = require('passport'),
    config = require('../config'),
    db = require('./models');

var server = module.exports = oauth2orize.createServer();

// References https://github.com/FrankHassanabad/Oauth2orizeRecipes/blob/master/authorization-server/oauth2.js

/**
 * Authorization Code
 */
if (config.oauth2.features.code) {
    server.grant(oauth2orize.grant.code(function (application, redirectURI, user, ares, done) {
        console.log(arguments);

        db.AuthorizationCode.create({
            user: user.id,
            application: application.id,
            redirectUri: redirectURI,
            state: application.state,
            scope: application.scope,
            expires: Date.now() + config.oauth2.authorizationCode.expires
        }, function(err) {
            if (err) return done(err);

            return done(null, code);
        });
    }));

    server.exchange(oauth2orize.exchange.code(function (application, code, redirectURI, done) {
        db.AuthorizationCode.findOne({code: code}).exec(function (err, authCode) {
            if (err) return done(err);
            if (!authCode) return done(null, false);
            if (application.id !== authCode.application) return done(null, false);
            if (redirectURI !== authCode.redirectUri) return done(null, false);

            authCode.remove();

            db.AccessToken.create({
                user: authCode.user,
                application: authCode.application,
                scope: authCode.scope,
                expires: Date.now() + config.oauth2.accessToken.expires
            }, function(err, accessToken) {
                if (err) return done(err);

                if (authCode.scope && authCode.scope.indexOf('offline_access') === 0) {
                    db.RefreshToken.create({
                        user: authCode.user,
                        application: authCode.application,
                        scope: authCode.scope,
                        expires: Date.now() + config.oauth2.refreshToken.expires
                    }, function(err, refreshToken) {
                        if (err) return done(err);

                        return done(null, accessToken.token, refreshToken.token, {state: authCode.state, expires_in: config.oauth2.accessToken.expires});
                    });
                } else {
                    return done(null, accessToken.token, null, {state: authCode.state, expires_in: config.oauth2.accessToken.expires});
                }
            });
        });
    }));
}

/**
 * Implicit
 */
if (config.oauth2.features.implicit) {
    server.grant(oauth2orize.grant.token(function (application, user, ares, done) {
        db.AccessToken.create({
            user: user.id,
            application: application.id,
            scope: application.scope,
            expires: Date.now() + config.oauth2.accessToken.expires
        }, function(err, accessToken) {
            if (err) return done(err);

            return done(null, accessToken.token, {expires_in: config.oauth2.accessToken.expires});
        });
    }));
}

/**
 * Password
 */
if (config.oauth2.features.password) {
    server.exchange(oauth2orize.exchange.password(function(application, username, password, scope, done) {
        // Validate the user
        db.User.findOne({username: username}).exec(function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!user.comparePassword(password)) return done(null, false);

            db.AccessToken.create({
                user: user.id,
                application: application.id,
                scope: scope,
                expires: Date.now() + config.oauth2.accessToken.expires
            }, function(err, accessToken) {
                if (err) return done(err);

                if (scope && scope.indexOf('offline_access') === 0) {
                    db.RefreshToken.create({
                        user: user.id,
                        application: application.id,
                        scope: scope,
                        expires: Date.now() + config.oauth2.refreshToken.expires
                    }, function(err, refreshToken) {
                        if (err) return done(err);

                        return done(null, accessToken.token, refreshToken.token, {expires_in: config.oauth2.accessToken.expires});
                    });
                } else {
                    return done(null, accessToken.token, null, {expires_in: config.oauth2.accessToken.expires});
                }
            });
        });
    }));
}

/**
 * Client credentials
 */
if (config.oauth2.features.client) {
    server.exchange(oauth2orize.exchange.clientCredentials(function(application, scope, done) {
        db.AccessToken.create({
            user: null,
            application: application.id,
            scope: application.scope,
            expires: Date.now() + config.oauth2.accessToken.expires
        }, function(err, accessToken) {
            if (err) return done(err);

            return done(null, accessToken.token, null, {expires_in: config.oauth2.accessToken.expires});
        });
    }));
}


server.exchange(oauth2orize.exchange.refreshToken(function(application, refreshToken, scope, done) {
    db.RefreshToken.findOne({token: refreshToken}).exec(function (err, refreshToken) {
        if (err) return done(err);
        if (!refreshToken) return done(null, false);
        if (application.id !== refreshToken.application) return done(null, false);

        db.AccessToken.create({
            user: refreshToken.user,
            application: application.id,
            scope: refreshToken.scope,
            expires: Date.now() + config.oauth2.accessToken.expires
        }, function(err, accessToken) {
            if (err) return done(err);

            return done(null, accessToken.token, null, {expires_in: config.oauth2.accessToken.expires});
        });
    });
}));





// Register serialialization and deserialization functions.
//
// When an application redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// application object is serialized into the session.  Typically this will be a
// simple matter of serializing the application's ID, and deserializing by finding
// the application by ID from the database.

server.serializeClient(function (application, done) {
    return done(null, application.id);
});

server.deserializeClient(function (id, done) {
    db.Application.findById(id, function (err, application) {
        if (err) {
            return done(err);
        }
        return done(null, application);
    });
});
