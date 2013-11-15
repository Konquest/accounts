var db = require('../../db'),
    __ = require('underscore');

module.exports.search = function(req, res, next) {
    db.User.find().exec(function(err, users) {
        if (err) return next(err);
        
        db.User.migrate(users);
        
        res.format({
            html: function() {
                res.render('users/index', {users: users});
            },
            json: function() {
                var userList = __.map(users, function(user) { return user.normalize(); });
                res.json(userList);
            }
        });

    });
};

module.exports.form = function(req, res, next) {
    res.render('users/form');
};

module.exports.create = function(req, res, next) {
    var user = __.pick(req.body, 'name', 'email', 'username', 'password');
    
    db.User.create(user, function(err, user) {
        if (err) return next(err);
        user = __.pick(user.toJSON({getters: true}), 'id', 'name', 'username', 'created');
        req.flash('success', 'Successfully created user, ' + user.username);
        
        res.format({
            html: function() {
                res.redirect('/session');
            },
            json: function() {
                res.set('Location', '/users/' + user.username);
                res.json(201, user);  // Created
            }
        });
    });
};

module.exports.show = function(req, res, next) {
    var username = req.params.username || req.user.username;
    
    db.User.findOne({username: username}).exec(function(err, user) {
        if (err) return next(err);
        
        user = __.pick(user.toJSON({getters: true}), 'id', 'name', 'created');
        res.format({
            html: function() {
                res.render('users/show', user);
            },
            json: function() {
                res.json(user);
            }
        });
    });
};
