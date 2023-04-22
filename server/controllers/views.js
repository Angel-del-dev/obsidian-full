// const mysql = require('../lib/mysql.js');
const mCookies = require('cookies');
const { base64encode } = require('nodejs-base64');
const config = require("dotenv").config().parsed;

const index = (req, res) => {
    // const sql = new mysql();
    // const mRes = sql.query('SELECT * FROM users')
    // res.json(mRes);
    const cookie = new mCookies(req, res);

    if(cookie.get('conf', {signed: false}) == undefined) cookie.set('conf', base64encode(req.user.id), {signed: false});
    // if(cookie.get('conf', {signed: false}) == undefined) cookie.set('conf', req.user.id, {signed: false});
    console.log(config.VERSION);
    res.render('main.ejs', { version: config.VERSION });
};

module.exports.index = index;