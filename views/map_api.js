var map;
var polyline = null;
var yelpMarkers = [];
var userLoggedIn = false;
var start_locations = [];
var meeting_locations = [];

function halfwayMeetMap() {
  //See if user is logged in
  //If so get default start locations
  //Start out with zoomed out map of the US
  $.ajax({
  url: 'api/user',
  method: 'GET',
    success: function(data){
      console.log('User data:');
      console.log(data.loggedIn);
      userLoggedIn = data.loggedIn;
      start_locations = data.start_locations;
      meeting_locations = data.meeting_locations;
      console.log(start_locations);
      console.log(meeting_locations);
      // get user login/location info
      if (userLoggedIn){
        $('#not-logged-in').hide();
        $('#logged-in').show();
        // preload datalists
        var dataList1 = $("#loc-list1");
        var dataList2 = $("#loc-list2");
        dataList1.empty();
        dataList2.empty();
        if(start_locations.length) {
          for(var i=0; i<start_locations.length; i++) {
            var opt = $('<option>').attr('value', start_locations[i].location);
            
            //var opt = $('<option value="'+start_locations[i].location+'" '+ 'label="'start_locations[i].location'">');
            //.attr("label", start_locations[i].location);
            dataList1.append(opt);
            opt = $('<option>').attr('value', start_locations[i].location);
            dataList2.append(opt);
          }
        }
        console.log('user logged in');
      } else {
        $('#not-logged-in').show();
        $('#logged-in').hide();
        console.log("user not logged in");
      }
      for (var i=0; i<10; i++) {
        $('#yelpResults'+i).hide();
      }
    }
  });

  var directionsService = new google.maps.DirectionsService;
  //var directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,  // default
    center: {lat: 36.0219, lng: -105.4814}
  });
  //See comments below regarding making this draggable
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true
  });

  polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
  });

  directionsDisplay.setMap(map);

  var start_location1;
  var start_location2;
  var place_of_interest;
  // trigger Display route, get halfway yelp results on button press
  //$('#map-search-form').on('submit', function(evt) {
  $('#mapSearchButton').click(function() {
    //evt.preventDefault();
    if (userLoggedIn) {
      start_location1 = $('#userLocationL').val();
      start_location2 = $('#friendLocationL').val();
    }
    else {
      start_location1 = $('#userLocationN').val();
      start_location2 = $('#friendLocationN').val();
    }
    place_of_interest = $('#placeOfInterest').val();

    displayRouteLocations(directionsService, directionsDisplay,
      start_location1, start_location2, place_of_interest);
  });

  //To update locations based on new directions:
  //This was getting called to often triggering yelp too many requests errors
  //also the drag worked, but it bounced back to the old locations
  //(Also this may defeat the purpose of finding a halfway place...)
  directionsDisplay.addListener('directions_changed', function() {
    console.log(directionsDisplay.directions);
        //var legs = response.routes[0].legs;
        //displayMeetingLocations(legs[0], place_of_interest);
  });
}

function displayRouteLocations(directionsService, directionsDisplay,
  start1, start2, place_of_interest) {
  directionsService.route({
    origin: start1,
    destination: start2,
    travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        polyline.setPath([]);
        directionsDisplay.setDirections(response);
        var legs = response.routes[0].legs;
        displayMeetingLocations(legs[0], place_of_interest);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }
  );
}

function displayMeetingLocations(leg, place_of_interest) {

  var midPoint = findHalfWayPoint(leg);
  //
  // Send api request to server yelp interface
  // Send: location and type(search term of request);
  // Recieve: array of names, yelp_urls, locations) to find meeting locations that are a certain radius from the calculated mid point.
  // (POST request, get stuff back in success section)
  //
  //First remove old markers
  for(var i=0; i<yelpMarkers.length; i++){
    yelpMarkers[i].setMap(null);
  }

  //Get Yelp data
  $.ajax({
    url: 'api/search',
    method: 'POST',
    data: {
      ll: midPoint.lat() + ', ' + midPoint.lng(),
      term: place_of_interest //from UI
    },
    success: function(data){
      for (var i = 0; i < data.length; i++) {
        //display yelp data as markers on the map
        var yelpPoint = new google.maps.LatLng(
          data[i].location.coordinate.latitude,
          data[i].location.coordinate.longitude);

        contentString = '<br>'+data[i].location.display_address
          +'<br>'+'<img src="'+data[i].rating_img_url_small+'">'
          +'<br>'+data[i].display_phone+'<br>'
          +'<a href="'+data[i].mobile_url+'">Yelp</a>'

        var save_loc = '';
        for (var j=0; j<data[i].location.display_address.length; j++) {
          save_loc = save_loc+' '+data[i].location.display_address[j];
        }
        var save_name = data[i].name;

        data[i].name = (i+1)+'. '+data[i].name;

        marker = createMarker(yelpPoint, data[i].name, contentString);
        yelpMarkers.push(marker);

        //also display yelp data on the side window
        var buttonId = 'loc-save-btn' + i;
        var saveButton = '';
        if (userLoggedIn) {
          saveButton = '<br><button class="btn btn-success btn-xs" id="'
            +buttonId+'">Save to my Meeting Locations</button>';
        }
        $('#yelpResults'+i).html(data[i].name+contentString+saveButton);
        $('#yelpResults'+i).show();

        // put yelp info (with button if logged in) in yelpResults div
        if (userLoggedIn) {
          $('#'+buttonId).click({loc: save_loc, name: save_name, yelp_url: data[i].mobile_url}, function(event) {
            console.log(this.id + ' clicked! loc = ' + event.data.loc
              + ", save_name = " + event.data.save_name + ", url = " + event.data.yelp_url);
            $.ajax({
              url: 'api/add_loc',
              method: 'POST',
              data: {
                //message: "Saving user selected meeting location",
                m_loc: event.data.loc,
                name: event.data.name,
                yelp_url: event.data.yelp_url
              },
              success: function(data){
                console.log('SUCCESS adding selected meeting loc to DB!')
              },
              dataType: 'json'
            });
          });
        } //if (userLoggedIn)
      } //for loop
    },
    dataType: 'json'
  });
}

// Return mid-point from trip leg (list of segent points)
function findHalfWayPoint(leg) {
  //Set up poly line along route based on segments (turn/merge/etc points in the route)
  //console.log(legs)
  //A leg is the whole route to a way-point or to the end
  //(We are not allowing way points, so there's only one leg)
  var distance = leg.distance.value; //meters
  var totalTime = leg.duration.value; //seconds

  steps = leg.steps;
  for (var i = 0; i < steps.length; i++) {
    var nextSegment = steps[i].path;
    for (var k=0;k<nextSegment.length;k++) {
      polyline.getPath().push(nextSegment[k]);
    }
  }
  //polyline.setDraggable(true);
  polyline.setMap(map);

  // Add a method to the PolyLine class(object constructor) to return
  // a google.maps.LatLng of a point at a given distance along the path
  // Returns null if the path is shorter than the specified distance
  google.maps.Polyline.prototype.GetPointAtDistance = function(meters) {
    // some awkward special cases
    if (meters == 0) return this.getPath().getAt(0);
    if (meters < 0) return null;
    if (this.getPath().getLength() < 2) return null;
    var dist=0;
    var olddist=0;
    for (var i=1; (i < this.getPath().getLength() && dist < meters); i++) {
      olddist = dist;
      dist += google.maps.geometry.spherical.computeDistanceBetween(
        this.getPath().getAt(i),
        this.getPath().getAt(i-1)
      );
    }
    if (dist < meters) {
      return null;
    }
    var p1= this.getPath().getAt(i-2);
    var p2= this.getPath().getAt(i-1);
    var m = (meters-olddist)/(dist-olddist);
    return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
  }

  //Compute half way
  var halfDist = distance / 2; //in meters
  var halfTime = totalTime / 2;
  var miDist = 0.62137 * (halfDist / 1000.0); //in miles if ever needed
  return polyline.GetPointAtDistance(halfDist);
}

function createMarker(latlng, label, contentString) {
  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: label,
      zIndex: Math.round(latlng.lat()*-100000)<<5
  });
  marker.myname = label;
  infowindow = new google.maps.InfoWindow();

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(label+contentString);
    infowindow.open(map,marker);
  });
  return marker;
}

//button for side bar
$('body').on('click', '.fa-bars', function() {
  console.log('button clicked');
  if ($('.form').hasClass('showBar')) {
    $('.form').removeClass('showBar');
  } else {
    $('.form').addClass('showBar');
  }
});
