var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var generate_uid = require('./routes/generate_uid');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/generate_uid', generate_uid);

app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", 'Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Request-Credentials, Access-Control-Request-Methods, Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description, Origin, X-Requested-With, Accept');
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

module.exports = app;
