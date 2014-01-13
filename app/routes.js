var login = require('connect-ensure-login'),
    // oauth2 = require('./oauth2'),
    controllers = require('./controllers');

// Route to Controller Dispatcher

module.exports.setup = function(app) {
    var loginCheck = login.ensureLoggedIn('/session');
    
    app.get('/', controllers.index);
    
    app.get('/session', controllers.session.index);    // Login form
    app.post('/session', controllers.session.login);    // Login
    app.delete('/session', controllers.session.logout);    // Logout
    app.get('/session/logout', controllers.session.logout);    // Logout
    
    /*
    app.get('/me', loginCheck, controllers.users.showSelf);    // User profile page
    app.post('/me', loginCheck, controllers.users.update);    // Update user profile
    app.delete('/me', loginCheck, controllers.users.wip);    // User mark for delete
    */
    
    app.get('/users', loginCheck, controllers.users.search);    // User listings + search
    app.get('/users/new', controllers.users.form);    // Registration form
    app.post('/users', controllers.users.create);    // Registration
    app.post('/users/new', controllers.users.create);    // Registration alias
    
    app.get('/users/:username', loginCheck, controllers.users.show);    // Specific user profile page
    //app.delete('/users/:username', loginCheck, controllers.users.wip);    // User mark for delete (only if self)
    
    app.get('/applications', loginCheck, controllers.applications.wip);    // Applications listing + search
    app.get('/applications/new', loginCheck, controllers.applications.wip); // New application form
    app.post('/applications', loginCheck, controllers.applications.wip);    // Create application
    app.post('/applications/new', loginCheck, controllers.applications.wip);    // Create application alias
    app.get('/applications/:id', loginCheck, controllers.applications.wip);    // Specific application details page
    app.post('/applications/:id', loginCheck, controllers.applications.wip);    // Update application details
    app.delete('/applications/:id', loginCheck, controllers.applications.wip);    // Application mark for delete (only if user owned)
    
    app.get('/oauth2/authorize', loginCheck, controllers.oauth2.wip);    // Authorization dialog
    app.post('/oauth2/authorize', loginCheck, controllers.oauth2.decision);    // Authorization decision
    app.post('/oauth2/token', controllers.oauth2.wip);    // Access token request
};
