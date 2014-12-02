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


//--------------------------------------------------------
//Passport-Local for Authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
  // yay!
  console.log("Connected to remote MongoDB database");
});

function find (collec, query, fields, callback, number) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query,fields).limit(number).toArray(callback);
    });
}

//--------------------------------------------------------------
var router = express.Router();
var socket = require('./routes/socket.js');
var routes = require('./routes')
var routeEvents = require('./routes/events.js');
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//-------------------------------------
//initializing for passport authentication
app.use(passport.initialize());
app.use(passport.session());
var Account = require('./models/Account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', router); //registering all routes for our app

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//register app so all routes will use '/api'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ROUTES FOR OUR API
// -----------------------------------------------------

router.get('/', routes.index);
router.route('/events')
    .get(routeEvents.get)
    .post(routeEvents.post);


// redirect all others to the index (HTML5 history)
router.get('*', routes.index);

//----------------------------------------
// socket listening and responding to events
io.on('connection', socket);

//Starting a server on port 3000
http.listen(3000, function(){
  console.log('listening on port 3000');
});
