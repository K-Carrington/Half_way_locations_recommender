var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var FacebookStrategy  = require('passport-facebook').Strategy;
var configAuth      = require('./auth.js');

var User = require('../models/user.js');

//changing into a string that can be stored as a cookie
passport.serializeUser(function(user, done){
  done(null, user.id);
});

//confirm they're still logged in
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//strategy for signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  User.findOne({'local.email': email}, function(err, user){
    if(err) return done(err);
    if(user) return done(null, false, req.flash('signUpMessage', 'That email is already taken.'));

    var newUser = new User();
    newUser.local.first_name = req.body.first_name;
    newUser.local.last_name = req.body.last_name;
    newUser.local.email = req.body.email;
    //newUser.local.location....  //default location
    newUser.local.password = newUser.generateHash(password);

    newUser.save(function(err){
      if(err) throw err;
      return done(null, newUser, null);
    });
  });
}));

//passport strategy middleware authenticate user:
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  User.findOne({'local.email': email}, function(err, user) {
    if(err) throw err;
    if(!user) return done(null, false, req.flash('loginMessage', "No User Found."));
    if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong Password!'));
    return done(null, user);
  })
}))

passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: configAuth.facebookAuth.profileFields
}, function(token, refreshToken, profile, done){
  console.log(profile);
  User.findOne({'facebook.id': profile.id}, function(err, user) {
    if(err) return done(err);
    if(user) {
      return done(null, user);
    } else {
      var newUser = new User();
      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.facebook.name = profile.displayName;
      if (profile.emails)
        newUser.facebook.email = profile.emails[0].value;

      newUser.save(function(err) {
        if(err) throw err;
        return done(null, newUser);
      })
    } 
  })
}))

module.exports = passport;

