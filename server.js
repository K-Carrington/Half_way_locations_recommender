var express     = require('express');
var app         = express();
var logger      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var port        = process.env.PORT || 3000;

//connect to database
var db = 'mongodb://localhost/halfway_meet';
mongoose.connect(db, function(err){
  if(err) return console.log('Cannot connect to ' + db + ' database.');
  console.log('Connected to ' + db + ' database.');
});

//middleware
app.use(logger('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

//user routes
var userRoutes = require('./routes/users.js');

//root route
app.use('/', userRoutes);

app.get('/', function(){
  res.render('index');
});

//static index
app.use(express.static('public'));

app.listen(port, function(){
  console.log('Server running on ' + port);
});
