var express        = require('express');
var app            = express();
var logger         = require('morgan');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var ejs            = require('ejs');
var ejsLayouts     = require('express-ejs-layouts');
var flash          = require('connect-flash');
var	cookieParser   = require('cookie-parser');
var	session        = require('express-session');
var	passport       = require('passport');
var	passportConfig = require('./config/passport.js');
var yelp           = require('./config/yelp.js');
var port           = process.env.PORT || 3000;
var uriUtil        = require('mongodb-uri');

//connect to local database
// var db = 'mongodb://localhost/halfway_meet';
//connect to mongolab
// var db = 'mongodb://eunice:123456@ds057954.mongolab.com:57954/halfway_meet';
var mongodbUri = 'mongodb://eunice:123456@ds057954.mongolab.com:57954/halfway_meet';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, function(err){
  if(err) return console.log('Cannot connect to ' + db + ' database.');
  console.log('Connected to ' + db + ' database.');
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

//middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//ejs configuration
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// session middleware
app.use(session({
	secret: 'oreonotomohakiminotomoda',
	cookie: {_expires: 600000000}
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function(req,res,next){
  app.locals.loggedIn = req.isAuthenticated()
  //console.log("****req = ")
  //console.log(req)
  next()
})

//user routes
var userRoutes = require('./routes/user_route.js');

//map routes
//var mapRoutes = require('./routes/map_route.js');
//app.get('/map', function(req, res) {
//  res.render('map')
//})
// app.use(express.static('public'));

//root route
app.use('/', userRoutes);

app.get('/', function(req, res, next){
  res.render('index');
});

app.post('/api/search', function(req, res){
  yelp.search({term: req.body.term, limit: 10, ll: req.body.ll})
    .then(function (data) {
      for (var i = 0; i < data.businesses.length; i++){
        //console.log(data.businesses[i].name);
        //console.log(data.businesses[i].url);
        //console.log(data.businesses[i].location);
      }
      //console.log(data.businesses)
      console.log("IN SERVER GETTING YELP DATA")
      res.json(data.businesses)
    })
  .catch(function (err) {
    console.error(err);
  });
});



//User AJAX Routes:
//TBD need to get rid of this and replace with route call 
//  to pass user info to map_api
/*
app.get('/api/user', function(req, res){
  var User = require('./models/user.js');
  var data;
  var user_id = passportConfig.ret_user_id();

  if (user_id) {
    User.findById(user_id, function(err, user){
      if(err) res.send(err);
      //console.log("3* Found user!")
      if (user) {
        data = {
            loggedIn: app.locals.loggedIn,
            start_locations: user.start_locations,
            meeting_locations: user.meeting_locations
        };
      }
      else {
        data = {
          loggedIn: app.locals.loggedIn,
          start_locations: [],
          meeting_locations: []
        };
      }
      res.json(data);
    });
  }
  else {
    data = {
      loggedIn: app.locals.loggedIn,
      start_locations: [],
      meeting_locations: []
    };
    res.json(data);
  }
});
*/

//be able to access client assets
app.use(express.static('views'));

// shows map.html
//app.get('/map', function(req, res){
//  console.log('in server rendering map_api')
  //TBD need to pass user info in this way instead of through ajax
//  console.log(req)
//  res.render('map_api')
//})

app.listen(port, function(){
  console.log('Server running on ' + port);
});
