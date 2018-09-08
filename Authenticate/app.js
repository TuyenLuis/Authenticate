const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');



let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}))
app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res) => {
    res.render('index.ejs');
})


let con = require('./config/database')(mysql);
con.connect((err) => {
    if(err) console.error(err)
    else console.log("Database is connected");

    con.query(`CREATE TABLE local (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255))`, (err) => {
        console.log('Table local is created');
    })
    con.query(`CREATE TABLE facebook (id VARCHAR(255)  PRIMARY KEY, username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL, password VARCHAR(255), token VARCHAR(255))`, (err) => {
        console.log('Table facebook is created');
    })
    con.query(`CREATE TABLE google (id VARCHAR(255)  PRIMARY KEY, username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL, password VARCHAR(255), token VARCHAR(255))`, (err) => {
        console.log('Table google is created');
    })
})

require('./route/login')(app, passport);
require('./route/signup')(app, passport);
require('./route/loginFacebook')(app,passport);
require('./route/loginGoogle')(app,passport);
require('./config/passport')(passport);
const port = 6969;
app.listen(port, (err) => {
    if(err) console.error(err);
    else console.log("Server is running at port " + port);
})

