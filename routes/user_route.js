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
  }));

userRouter.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile', {user: req.user});
});

userRouter.route('/profile/:email')
  .get(isLoggedIn, function(req, res) {
    res.render('edit', {user: req.user});
  })
  .post(usersController.update, function(req, res){
    console.log("Called controller update");
    req.redirect('/profile');
  });

userRouter.get( '/update', function( req, res ) {
  console.log("Yeah hooo!", req.body );
  res.json( "It's in there");
} );

userRouter.post( '/update', usersController.update, function(req, res){
    console.log("Called controller update2");
    req.redirect('/profile');
  });

userRouter.get( '/destroy/:email', usersController.destroy);

userRouter.route('/map')
  .get(function(req, res){
    //console.log("rendering map_api, req = ")
    if(req.isAuthenticated())
      res.render('map_api', {user: req.user});
    else
      res.render('map_api', {user: null});
  });

  userRouter.route('/locations')
  .get(function(req, res){
    res.render('locations', {user: req.user});
  });

//route for add start location (only)
userRouter.post( '/createLocation', usersController.createLocation, function(req, res){
    console.log("Called controller createLocation");
    //req.redirect('/locations');
  });

//routes for edit and delete locations:
userRouter.route('/edit_s_loc/:index')
  .get(function(req, res){
    res.render('edit_s_loc', {user: req.user, index: req.params.index });
  })
userRouter.post('/update_s_loc/:index', usersController.update_s_loc, function(req, res){
    console.log("alled controller update_s_loc");
    req.redirect('/locations');
  });
//  .put(usersController.update_s_loc, function(req, res){
//    console.log("Called controller update_s_loc");
//    req.redirect('/locations');
//  });
userRouter.get( '/delete_s_loc/:index', usersController.delete_s_loc);
userRouter.get( '/delete_m_loc/:index', usersController.delete_m_loc);

//facebook routes
userRouter.get('/auth/facebook', passport.authenticate('facebook', {
	scope:['email']}));

userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/profile',
	failureRedirect: '/'
}));

userRouter.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = userRouter;
