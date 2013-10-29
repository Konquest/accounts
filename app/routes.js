var controllers = require('./controllers');

module.exports.setup = function(app) {
    app.get('/', controllers.root.index);
};