var User = require('../models/user.js');

// function edit(req, res){
//   console.log("Current user: " + req.user.local.email)
//   User.findById(req.user._id, function(err){
//     if(err) res.send(err);
//     res.render( 'edit', {
//         first_name   : user.local.first_name
//     });
//   })
// }

function update(req, res){
  console.log('User being updated: ', req.body )
  User.findById(req.body.id, function(err, user){
    console.log("YAY", user);
    if(err) res.send(err);

    if(req.body.first_name)
      user.local.first_name = req.body.first_name;
    if(req.body.last_name)
      user.local.last_name = req.body.last_name;
    if(req.body.email)
      user.local.email = req.body.email;

    user.save(function(err){
      if (err) res.send(err);
      console.log("User updated")
      res.redirect('/profile');
      // res.json({success: true, message: 'User successfully updated'})
    });
  });
}

function destroy(req, res){
  console.log("user being deleted:", req.user.local.email)
  User.findByIdAndRemove(req.user._id, function(err){
    if(err) res.send(err);
    res.redirect('/');
    // res.json({success: true, message: 'User deleted'})
  })

}

module.exports = {
  // edit: edit,
  update: update,
  destroy: destroy
}
