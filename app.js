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
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

// redirect all others to the index (HTML5 history)
router.get('*', routes.index);

// router.get('/',function(req,res){
//      // res.sendFile(__dirname + '/views/index');
//      console.log("Serving get request on /");
//      res.render('index', { title: 'Express' });
// });

//-------------------------------------------------
// router.route('/events')

//      //create an event accessible at /api/events/
//      .post(function(req, res){

//      })
//      //get all events from DB limit to 20
//      .get(function(req,res){
//         console.log("Fetching events");
//         find('events',{}, {eventTitle: 1},function(err,events){
//           res.send(events);
//         },15);
//      });

//      //create a new event
// router.route('/events/:event_id')
//     .get(function(req,res){
//       console.log("Get request for a specific event")
//     });



//----------------------------------------
io.on('connection', socket);


// io.on('connection', function(socket){
//   console.log('a user connected');
//   io.emit('info', { msg: 'Enjoy the decline' });

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });

//     //recieve client data
//   socket.on('client_comment', function(data){
//     console.log(data.comment);
//     // socket.broadcast.emit('new_comment',{msg : data.comment});
//   });

//   socket.on('creator_stream', function(data){
//     console.log("The Creator sent something", data);
//     socket.broadcast.emit('new_comment',{msg: data.comment});
//   })
// });


//Starting a server on port 3000
http.listen(3000, function(){
  console.log('listening on port 3000');
});
