var express         = require('express');
var passport        = require('passport');
var userRouter      = express.Router();
var usersController = require('../controllers/user_controller.js');

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

userRouter.route('/profile/:email')
  .get(isLoggedIn, function(req, res) {
    res.render('edit', {user: req.user})
  })
  .put(usersController.update, function(req, res){
    req.redirect('/profile')
  })

userRouter.route('/locations')
  .get(function(req, res){
    res.render('locations', {user: req.user})
  })

userRouter.get( '/update', function( req, res ) {
  console.log("Yeah hooo!", req.body )
  res.json( "It's in there")
} )

userRouter.post( '/update', usersController.update)
userRouter.get( '/destroy/:email', usersController.destroy)

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
