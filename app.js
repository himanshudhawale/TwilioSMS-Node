var path = require('path');
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var urlencoded = require('body-parser').urlencoded;
var config = require('./config');
var message = require('./routes/route');
var Promise = require('bluebird');
var cors=require('cors');


// use node A+ promises
mongoose.Promise = Promise;

mongoose.connect('mongodb://127.0.0.1:27017/inclass?compressors=zlib&gssapiServiceName=mongodb');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
