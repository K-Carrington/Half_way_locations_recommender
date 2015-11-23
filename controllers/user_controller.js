var User = require('../models/user.js');

function update(req, res){
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err);

    if(req.body.first_name)
      user.first_name = req.body.first_name;
    if(req.body.email)
      user.email = req.body.email;

    user.save(function(err){
      if (err) res.send(err)
      res.json({success: true, message: 'User successfully updated'})
    })
  })
}

function destroy(req, res){
  // req.local.
  User.findOneAndRemove(req.params.local.email, function(err, user){
    if(err) res.send(err)
    res.json({success: true, message: 'User deleted'})
  })
}

module.exports = {
  update: update,
  destroy: destroy
}
