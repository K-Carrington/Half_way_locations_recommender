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

//root route
app.use('/', userRoutes);

app.get('/', function(req, res){
  res.render('index');
});

//static index
app.use(express.static('public'));

app.listen(port, function(){
  console.log('Server running on ' + port);
});
