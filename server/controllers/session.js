// const mysql = require('../lib/mysql.js');
const mCookies = require('cookies');
const { base64decode, base64encode } = require('nodejs-base64');
const mysql = require('../lib/mysql.js');

const loginForm = (req, res) => {
    req.session.destroy(function (err) {
        res.render('login.ejs', {  });
    });
};

const login = (req, res) => {  /* Controlled by middleware 'sessionMiddleware' */ };

const logout = (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/login'); //Inside a callback… bulletproof!
    });
};

const sessionMiddleware = (req, res, next) => {
    // Middleware to force session on some routes
    const cookie = new mCookies(req, res);
    if(req.isAuthenticated() || cookie.get('conf', {signed: false}) != undefined) { 
        if(cookie.get('conf', {signed: false}) == undefined)  cookie.set('conf', base64encode(req.user.id), {signed: false});  
        return next();
    }
    res.redirect('/login');
};

const sessionMiddlewareData = (req, res, next) => {
    // Middleware to force session on some routes
    const cookie = new mCookies(req, res);
    if(cookie.get('conf', {signed: false}) != undefined) {
        return next();
    }
    res.status(401).json({msg: 'Not autenticated'});
};

// const getCurrentUser = async (req, res) => {
//     const cookie = new mCookies(req, res);
//     if(cookie.get('conf', {signed: false}) != undefined) {
//         const id = base64decode(cookie.get('conf', {signed: false}));
//         const sql = new mysql();
//         var user = {id: 'test'};
//         sql.query(`SELECT * FROM users WHERE id = ${id} LIMIT 1`, user, (result) => {
//             user.id = 'not test';
//             if(result.length >= 1) {
//                 params = { code: 200, ...result[0]};
//             }else {
//                 // null si no hay error
//                 // false si no se ha encontrado el resultado
//                 params = { code: 404, msg: 'User not found'};
//             }
           
//         });
//         console.log(user);
//         return user;
//     }
//     user = { code: 401, msg: 'Not authenticated'};
//     return user;
// }

const getCurrentId = (req, res) => {
    const cookie = new mCookies(req, res);
    return  base64decode(cookie.get('conf', {signed: false}));
}

module.exports.loginForm = loginForm;
module.exports.login = login;
module.exports.logout = logout;
module.exports.sessionMiddleware = sessionMiddleware;
module.exports.sessionMiddlewareData = sessionMiddlewareData;
// module.exports.getCurrentUser = getCurrentUser;
module.exports.getCurrentId = getCurrentId;