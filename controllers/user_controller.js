var User = require('../models/user.js');

function show (req, res){
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err)
    res.json(user)
  })
}
