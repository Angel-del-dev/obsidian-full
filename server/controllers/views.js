// const mysql = require('../lib/mysql.js');
const mCookies = require('cookies');
const { base64encode } = require('nodejs-base64');

const index = (req, res) => {
    // const sql = new mysql();
    // const mRes = sql.query('SELECT * FROM users')
    // res.json(mRes);
    const cookie = new mCookies(req, res);

    if(cookie.get('conf', {signed: false}) == undefined) cookie.set('conf', base64encode(req.user.id), {signed: false});
    // if(cookie.get('conf', {signed: false}) == undefined) cookie.set('conf', req.user.id, {signed: false});
    res.render('main.ejs', {  });
};

module.exports.index = index;