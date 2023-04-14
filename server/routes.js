const views = require('./controllers/views.js');
const folder = require('./controllers/folder.js');
const sessionController = require('./controllers/session.js');

// Controllers

const serve = (app, router, passport) => {
    router.get('/', sessionController.sessionMiddleware, views.index);

    router.post('/workspace/folder', sessionController.sessionMiddlewareData, folder.get);

    router.get('/login', sessionController.loginForm);
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }), sessionController.login);

    router.get('/logout', sessionController.logout);

    // Not found
    router.get('*', (req, res) => {
        res.redirect('/login');
    });

    app.use(router);
};

module.exports.serve = serve;