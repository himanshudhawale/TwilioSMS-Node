var path = require('path');
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var urlencoded = require('body-parser').urlencoded;
var config = require('./config');
var message = require('./routes/route');
var Promise = require('bluebird');

// use node A+ promises
mongoose.Promise = Promise;

mongoose.connect('mongodb://127.0.0.1:27017/inclass?compressors=zlib&gssapiServiceName=mongodb');

// Create Express web app with some useful middleware
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));

// Twilio Webhook routes

app.post('/message', message);

module.exports = app;
