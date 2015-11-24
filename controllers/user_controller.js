var User = require('../models/user.js');

function update(req, res){
  User.find({email: req.params.email}, function(err, user){
    if(err) res.send(err);

    if(req.body.first_name)
      user.first_name = req.body.first_name;
    if(req.body.last_name)
      user.last_name = req.body.last_name;
    if(req.body.email)
      user.email = req.body.email;

    user.save(function(err, user){
      if (err) res.send(err)
      res.redirect('/profile')
      // res.json({success: true, message: 'User successfully updated'})
    })
  })
}

function destroy(req, res){
  console.log("user being deleted:", req.user.local.email)
  User.findByIdAndRemove(req.user._id, function(err){
    if(err) res.send(err)
    res.redirect('/')
    // res.json({success: true, message: 'User deleted'})
  })

}

module.exports = {
  update: update,
  destroy: destroy
}
