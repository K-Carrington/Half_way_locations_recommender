  var map;
  var polyline = null;
  var yelpMarkers = [];
  var userLoggedIn = false;
  var start_locations = [];
  var meeting_locations = [];

  function createMarker(latlng, label, html) {
    var contentString = '<b>'+label+'</b><br>'+html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        zIndex: Math.round(latlng.lat()*-100000)<<5
    });
    marker.myname = label;

    infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
      //infowindow.setContent(contentString+"<br>"+marker.getPosition().toUrlValue(6));
      infowindow.setContent(contentString);
      infowindow.open(map,marker);
    });
    return marker;
  }

  function initMap() {
    //See if user is logged in
    //If so get default start 1 location...
    //if not put up zoomed out map of US
    $.ajax({
    url: 'api/user',
    method: 'GET',
     success: function(data){
      console.log("User data:");
      console.log(data.loggedIn);
      userLoggedIn = data.loggedIn;
      start_locations = data.start_locations;
      meeting_locations = data.meeting_locations;
      console.log(start_locations);
      console.log(meeting_locations);
      //TBD get user login/location info
     }
   });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,  // TBD 4 if user not logged in (and skip calling Route)
      center: {lat: 34.0219, lng: -118.4814}
    });

    polyline = new google.maps.Polyline({
      path: [],
      strokeColor: '#FF0000',
      strokeWeight: 3
    });

    directionsDisplay.setMap(map);

    // trigger Display route, get halfway yelp results on button press
    //$('#map-search-form').on('submit', function(evt) {
    $('#mapSearchButton').click(function() {
      //evt.preventDefault();
      var start_location1 = $('#userLocation').val();
      var start_location2 = $('#friendLocation').val();
      var place_of_interest = $('#placeOfInterest').val();
      console.log("in mapSearchButton callback")
      console.log("User loc: " + start_location1)
      console.log("Fr loc: " + start_location2)
      console.log("Term: " + place_of_interest)    
    
      calculateAndDisplayRoute(directionsService, directionsDisplay,
        start_location1, start_location2, place_of_interest);
    }); 
  }  

  function calculateAndDisplayRoute(directionsService, directionsDisplay,
    start1, start2, place_of_interest) {
    directionsService.route({
      origin: start1,
      destination: start2,
      //origin: document.getElementById('start').value,
      //destination: document.getElementById('end').value,
      travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          polyline.setPath([]);
          directionsDisplay.setDirections(response);
          var legs = response.routes[0].legs;
          //marker = createMarker(legs[0].start_location,"midpoint","","green");

          var midPoint = findHalfWayPoint(legs[0]);

          //console.log(midPoint.lat());
          //console.log(midPoint.lng());
          //var marker = new google.maps.Marker({
          //  position: midPoint,
          //  title: miDist + ' miles'
          //});
          //marker.setMap(map);
          //marker = createMarker(midPoint,"dist: "+miDist,"<a href=\"http://www.cnn.com\">CNN</a>");
          //console.log(midPoint);

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
          $.ajax({
            url: 'api/search',
            method: 'POST',
            data: {
              ll: midPoint.lat() + ", " + midPoint.lng(),
              term: place_of_interest //from UI
            },
            success: function(data){
              console.log("Data returned from Yelp I/F:");
              for (var i = 0; i < data.length; i++) {
                //console.log(data[i].location.coordinate.latitude)
                //console.log(data[i].location.coordinate.longitude)
                var yelpPoint = new google.maps.LatLng(
                  data[i].location.coordinate.latitude,
                  data[i].location.coordinate.longitude);

                  marker = createMarker(
                    yelpPoint,
                    data[i].name+"<br>"+data[i].location.display_address
                    +"<br>"+"<img src=\""+data[i].rating_img_url_small+"\">"
                    +"<br>"+data[i].display_phone,
                    "<a href=\""+data[i].mobile_url+"\">Yelp</a>");
                  yelpMarkers.push(marker);
               }
            },
            dataType: 'json'
          });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  // Return mid-point from trip leg (list of segent points)
  function findHalfWayPoint(leg) {
    //Set up poly line along route based on segments (turn/merge/etc points in the route)
    //console.log(legs)
    //A leg is the whole route to a way-point or to the end
    //(We are not allowing way points, so there's only one leg)
    var distance = leg.distance.value; //meters
    var totalTime = leg.duration.value; //seconds
    console.log("DISTmeters:"+distance+", "+"DURseconds:"+totalTime);
    steps = leg.steps;
    for (var i = 0; i < steps.length; i++) {
    // console.log(steps[i].duration.value);
    // console.log(steps[i].end_location.lat());
    // console.log(steps[i].end_location.lng());
    var nextSegment = steps[i].path;
      for (var k=0;k<nextSegment.length;k++) {
        polyline.getPath().push(nextSegment[k]);
      }
    }
    polyline.setDraggable(true);
    polyline.setMap(map);

    // Add a method to the PolyLine class(object constructor) to return
    // a google.maps.LatLng of a point at a given distance along the path
    // Returns null if the path is shorter than the specified distance
    google.maps.Polyline.prototype.GetPointAtDistance = function(metres) {
      // some awkward special cases
      if (metres == 0) return this.getPath().getAt(0);
      if (metres < 0) return null;
      if (this.getPath().getLength() < 2) return null;
      var dist=0;
      var olddist=0;
      for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
        olddist = dist;
        dist += google.maps.geometry.spherical.computeDistanceBetween(
          this.getPath().getAt(i),
          this.getPath().getAt(i-1)
        );
      }
      if (dist < metres) {
        return null;
      }
      var p1= this.getPath().getAt(i-2);
      var p2= this.getPath().getAt(i-1);
      var m = (metres-olddist)/(dist-olddist);
      return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
    }

    //Compute half way
    var halfDist = distance / 2; //in meters
    var halfTime = totalTime / 2;
    var miDist = 0.62137 * (halfDist / 1000.0);
    return polyline.GetPointAtDistance(halfDist);
  }

//button for side bar
$( "body" ).on( "click", ".fa-bars", function () {
    console.log('button clicked')
  if ( $( ".form" ).hasClass( "hello" ) ) {
    $( ".form" ).removeClass( "hello" )
  } else {
    $( ".form" ).addClass( "hello" )
  }
})
