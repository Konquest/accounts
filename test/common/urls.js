var fakeUser = require('./fixtures').newUser;

module.exports = {
    logout: '/session/logout',
    home: '/',
    users: '/users',
    profile: '/users/' + fakeUser.username,
    session: '/session'
};