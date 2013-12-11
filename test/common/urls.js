var fakeUser = require('./fixtures').newUser;

module.exports = {
    logout: '/session/logout',
    home: '/',
    users: '/users',
    profile: function(username) {
        return '/users/' + username;
    },
    session: '/session'
};