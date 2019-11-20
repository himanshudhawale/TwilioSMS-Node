var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors=require('cors');
var routes = require('./routes/route');
var MessagingResponse = require('twilio').twiml.MessagingResponse;

var app = express();

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
