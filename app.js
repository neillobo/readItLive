var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//require redis adaptor for multiple nodes, in cases of long polling to store in-memory
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
// var client = redis.createClient();

//--------------------------------------------------------
//Passport-Local for Authentication Configuration
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecret',
                 saveUninitialized: true,
                 resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

//-----------------------------------------------------------
//connecting to remote MongoDB database using Mongoose ORM
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/news');

require('./models/Events.js');
require('./models/Post.js');

// mongoose.connect('mongodb://readitlive:HR14Rules@proximus.modulusmongo.net:27017/Y8jyguwu');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB database");
});

//not being used anymore
function find (collec, query, fields, callback, number) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query,fields).limit(number).toArray(callback);
    });
}


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//-------------------------------------

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var socket = require('./routes/socket.js');
var routes = require('./routes/index')(passport);
app.use('/', routes);
//registering all routes for our app

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//register app so all routes will use '/api'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ROUTES FOR OUR API
// moved under routes

//----------------------------------------
// socket listening and responding to events
io.on('connection', socket);

//Starting a server on port 3000
http.listen(3000, function(){
  console.log('listening on port 3000');
});
