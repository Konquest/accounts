var oauth2 = require('./oauth2'),
    controllers = require('./controllers');

module.exports.setup = function(app) {
    app.get('/', controllers.index);
    app.get('/sessions', controllers.sessions.index);
};