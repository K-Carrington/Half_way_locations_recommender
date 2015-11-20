var express     = require('express');
var passport    = require('passport');
var userRouter  = express.Router();

userRouter.route('/login')
  .get(function(req, res){
    res.render('/login', {message: 'Login'});
  });

module.exports = userRouter;
