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


//connect to database
var db = 'mongodb://localhost/halfway_meet';
mongoose.connect(db, function(err){
  if(err) return console.log('Cannot connect to ' + db + ' database.');
  console.log('Connected to ' + db + ' database.');
});

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


//user routes
var userRoutes = require('./routes/user_route.js');

//map routes
//var mapRoutes = require('./routes/map_route.js');
//app.get('/map', function(req, res) {
//  res.render('map')
//})
app.use(express.static('public'));

//root route
app.use('/', userRoutes);

app.get('/', function(req, res){
  res.render('index');
});

app.post('/api/search', function(req, res){

  yelp.search({term: req.body.term, limit: 1, ll: req.body.ll})
    .then(function (data) {
      for (var i = 0; i < data.businesses.length; i++){
        console.log(data.businesses[i].name);
        console.log(data.businesses[i].url);
        console.log(data.businesses[i].location);
      }
      console.log(data.businesses)
      res.json(data.businesses)
    })
  .catch(function (err) {
    console.error(err);
  });
})

//be able to access client assets
app.use(express.static('views'));

// shows map.html
app.get('/map', function(req, res){
  res.sendFile(__dirname + '/views/map_api.html')
})

app.listen(port, function(){
  console.log('Server running on ' + port);
});
