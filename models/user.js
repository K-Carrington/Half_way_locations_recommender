var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
  local: {
    first_name: String,
    last_name: String,
    //location: String,     //default location
    email: {type: String},
    password: String
  },
  facebook: {
    id: String,
    name: String,
    token: String,
    email: String
  }
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
