var fakeUser = require('./dummies').newUser;

module.exports = {
    logout: '/session/logout',
    home: '/',
    users: '/users',
    userForm: '/users/new',
    profile: function(username) {
        return '/users/' + username;
    },
    session: '/session'
};