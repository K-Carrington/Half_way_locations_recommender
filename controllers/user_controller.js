var User = require('../models/user.js');

function createLocation(req, res){
  console.log('User adding starting location')
  User.findById(req.body.id, function(err, user){
    if (err) res.send(err);
    console.log("User pushing location");
    // pushes new location into array
    if(req.body.defaultLocation) {
      user.local.defaultLocation = req.body.defaultLocation;
      user.local.locName = req.body.locName;
      user.start_locations.push({location: req.body.defaultLocation, name: req.body.locName})
    }
  })
}

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

    // start_locations[0] is users defaultLocation
    if(req.body.defaultLocation) {
      user.local.defaultLocation = req.body.defaultLocation;
      user.start_locations[0].location = req.body.defaultLocation;
    }
    if(req.body.locName){
      user.local.locName = req.body.locName;
      user.start_locations[0].name = req.body.locName;
    }

    user.save(function(err){
      if (err) res.send(err);
      console.log('User updated');
      res.redirect('/profile');
    });
  });
}

function update_s_loc(req, res){
  console.log('saved loc being updated: ', req.body )
  User.findById(req.body.id, function(err, user){
    if(err) res.send(err);

    console.log("YAY2", user);
    console.log(req.body);
    return;

    // array.splice(index,1,new_item)
    if(req.body.defaultLocation) {
      user.local.defaultLocation = req.body.defaultLocation;
      user.start_locations[0].location = req.body.defaultLocation;
    }
    if(req.body.locName){
      user.local.locName = req.body.locName;
      user.start_locations[0].name = req.body.locName;
    }

    user.save(function(err){
      if (err) res.send(err);
      console.log('Loc updated');
      res.redirect('/locations');
    });
  });
}

function destroy(req, res){
  console.log('user being deleted:', req.user.local.email);
  User.findByIdAndRemove(req.user._id, function(err){
    if(err) res.send(err);
    console.log("User deleted");
    res.redirect('/');
  })
}

function delete_s_loc(req, res){
  console.log('starting loc being deleted:', req.body);
  //User.findByIdAndRemove(req.user._id, function(err){
    //if(err) res.send(err);
    //array.splice(index,1)
    //console.log("meeting loc deleted");
    ////res.redirect('/locations');
  //})
}

function delete_m_loc(req, res){
  console.log('meeting loc being deleted:', req.body);
  //User.findByIdAndRemove(req.user._id, function(err){
    //if(err) res.send(err);
    //array.splice(index,1)
    //console.log("meeting loc deleted");
    ////res.redirect('/locations');
  //})
}

module.exports = {
  update: update,
  destroy: destroy,
  createLocation: createLocation
}
