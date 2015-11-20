var express     = require('express');
var app         = express();
var logger      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var port        = process.env.PORT || 3000;

//connect to database
var db = 'halfway_meet';
mongoose.connect('mongodb://localhost/' + db, function(err){
  if(err) return console.log('Cannot connect to ' + db + ' database.');
  console.log('mongodb connected to ' + db + ' database.');
});

//middleware
app.use(logger('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

//static index
app.use(express.static('public'));

app.listen(port, function(){
  console.log('Server running on ' + port);
});
