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
    password: String,
    defaultLocation: String,
    locName: String
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
  meeting_locations: [{location: String, name: String, yelp_url: String}]
  //friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
  var user = this;
  return bcrypt.compareSync(password, user.local.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
