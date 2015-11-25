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

// function show(req, res){
//   User.find({}, function(err, user){
//     if(err)
//   })
// }

function update(req, res){
  console.log('User being updated: ', req.body )
  User.findById(req.body.id, function(err, user){
    if(err) res.send(err);

    console.log("YAY", user);
    if(req.body.first_name)
      user.local.first_name = req.body.first_name;
    if(req.body.last_name)
      user.local.last_name = req.body.last_name;
    if(req.body.email)
      user.local.email = req.body.email;
    if(req.body.defaultLocation) {
      user.local.defaultLocation = req.body.defaultLocation;
      user.start_locations.push({location: req.body.defaultLocation, name: "home"});
    }

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
  update: update,
  destroy: destroy
}
