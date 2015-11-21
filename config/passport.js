var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var FacebookStrategy  = require('passport-facebook').Strategy;
//var configAuth      = require('./auth.js');

var User = require('../models/user.js');

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//strategy for signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true;
}, function(req, email, password, done){
  User.findOne({'local.email': email}, function(err, user){
    if(err) return done(err);
    if(user) return done(null, false, req.flash('signUpMessage', 'That email is already taken.'));

    var newUser = new User();
    newUser.local.first_name = req.body.first_name;
    newUser.local.last_name = req.body.last_name;
    newUser.local.email = req.body.email;
    newUser.local.password = newUser.generateHash(password);

    newUser.save(function(err){
      if(err) throw err;
      return done(null, newUser, null);
    });
  });
}));
