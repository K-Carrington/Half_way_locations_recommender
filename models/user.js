var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//locations are an array that the user selected to save(or saved as a default)
//A location can contain the full address, the city/state or just the zip code
//A location name can be "Home", "School", "Work", "Coffee Bean", "Starbucks", etc.
var userSchema = new mongoose.Schema({
  //_id     : Number,
  local: {
    first_name: String,
    last_name: String,
    email: String,
    password: String
  },
  facebook: {
    id: String,
    name: String,
    first_name: String,
    last_name: String,
    hometown: Object,
    token: String,
    email: String
  },
  start_locations: [{location: String, name: String}],
  meeting_locations: [{location: String, name: String}]
  //locations : [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  //friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});
//
//It might be better and easier to make an arry of start and meeting
//locations for each user, but might want to do relations to user's friends
/*
var locationSchema = new mongoose.Schema({
  users     : [{ type: Number, ref: 'User' }]
  location: String, //address, city/state or zip code
  is_start_location: Boolean,
  is_meeting_location: Boolean
});
*/

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
  var user = this;
  return bcrypt.compareSync(password, user.local.password);
}

var User = mongoose.model('User', userSchema);
//var Location  = mongoose.model('Location', locationSchema);

module.exports = User;
