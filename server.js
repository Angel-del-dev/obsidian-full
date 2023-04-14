const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const mysql = require('./server/lib/mysql.js');
const md5 = require('md5');
const config = require("dotenv").config().parsed;
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// Login
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('secreto'));

app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username, password, done) {
    const sql = new mysql();
    const hash = md5(password);
    
    sql.query(`SELECT * FROM users WHERE name = '${username}' AND password = '${hash}'`, (result) => {
        if(result.length == 1) {
            return done(null, result[0]);
        }
        
        // Done
            // null si no hay error
            // false si no se ha encontrado el resultado
        done(null, false);
    
   
    });
   
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    const sql = new mysql();
    sql.query(`SELECT * FROM users WHERE id = ${id} LIMIT 1`, (result) => {
        if(result.length >= 1) return done(null, result[0]);
        // Done
            // null si no hay error
            // false si no se ha encontrado el resultado
        done(null, false);
    
   
    });
});

// End loging
const router = new express.Router();

const routes = require('./server/routes.js');
routes.serve(app, router, passport);

app.set('view engine', 'ejs');

app.set('views', 'views');

const port = parseInt(config.APP_PORT);

app.listen(port, function(err) {
    if(err) console.error(err);
    console.log('Server listening on port:', port)
});

