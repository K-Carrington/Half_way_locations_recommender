var express     = require('express');
var passport    = require('passport');
var userRouter  = express.Router();

userRouter.route('/login')
  .get(function(req, res){
    res.render('login', {message: req.flash('loginMessage')});
  })
  .post(passport.authenticate('local-login', {
  	successRedirect: '/profile',
  	failureRedirect: '/login',
  	failureFlash: true
  }))

userRouter.route('/signup')
  .get(function(req, res) {
  	res.render('signup', {message: req.flash('signupMessage')});
  })
  .post(passport.authenticate('local-signup', {
  	successRedirect: '/profile',
  	failureRedirect: '/signup',
  	failureFlash: true
  }))

userRouter.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile', {user: req.user})
})

//facebook routes
userRouter.get('/auth/facebook', passport.authenticate('facebook', {
	scope:['email']}))

userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/profile',
	failureRedirect: '/'
}))

userRouter.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/')
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = userRouter;
