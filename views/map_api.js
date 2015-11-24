  var map;
  var polyline = null;

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
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 34.0219, lng: -118.4814}
    });

    polyline = new google.maps.Polyline({
      path: [],
      strokeColor: '#FF0000',
      strokeWeight: 3
    });

    directionsDisplay.setMap(map);

    //TBD Temp for test
    var start_location1 = "Redondo Beach, CA";
    var start_location2 = "Santa Monica, CA";
    start_location1 = "90275"
  // TBD trigger on button
  //var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay,
      start_location1, start_location2);
  //};
  //document.getElementById('start').addEventListener('change', onChangeHandler);
  //document.getElementById('end').addEventListener('change', onChangeHandler);
  
  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay, start1, start2) {
    directionsService.route({
      origin: start1,
      destination: start2,
      //origin: document.getElementById('start').value,
      //destination: document.getElementById('end').value,
      travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          polyline.setPath([]);
          var bounds = new google.maps.LatLngBounds();
          directionsDisplay.setDirections(response);
          //var summaryPanel = document.getElementById("directions_panel");
          //summaryPanel.innerHTML = "";
          var legs = response.routes[0].legs;
          marker = createMarker(legs[0].start_location,"midpoint","","green");

          //console.log(legs)
          var distance = legs[0].distance.value; //meters
          var totalTime = legs[0].duration.value; //seconds
          console.log("DISTmeters:"+distance+", "+"DURseconds:"+totalTime);
          // iterate to find half way time point...
      
          steps = legs[0].steps;
          for (var i = 0; i < steps.length; i++) {
            // console.log(steps[i].duration.value);
            // console.log(steps[i].end_location.lat());
            // console.log(steps[i].end_location.lng());
            var nextSegment = steps[i].path;
            for (var k=0;k<nextSegment.length;k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);
            }
          }

          polyline.setMap(map);
    
          //Compute half way
          var halfDist = distance / 2;
          var halfTime = totalTime / 2; 

          // Add a method to PolyLine to return a google.maps.LatLng of a point 
          // at a given distance along the path
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

          
          var kmDist = halfDist / 1000.0;
          var miDist = 0.62137 * kmDist;
          var midPoint = polyline.GetPointAtDistance(halfDist);
          //console.log(midPoint.lat());
          //console.log(midPoint.lng());
          //var marker = new google.maps.Marker({
          //  position: midPoint,
          //  title: miDist + ' miles'
          //});
          //marker.setMap(map);
          //marker = createMarker(midPoint,"dist: "+miDist,"<a href=\"http://www.cnn.com\">CNN</a>");
          //console.log(midPoint);

          //document.getElementById("total").innerHTML = "total distance is: "+ kmDist + " km<br>total time is: " + (totalTime / 60).toFixed(2) + " minutes";

          //TBD send api request to server yelp interface
          //Send: location, type, number_of_desired_results; 
          //Recieve: array of names, yelp_urls, locations) to find meeting locations that are a certain radius from the calculated mid point.
          //POST request, get stuff back in success section
          $.ajax({
            url: 'api/search',
            method: 'POST',
            data: {
              ll: midPoint.lat() + ", " + midPoint.lng(),
              term: "coffee" // TBD //from UI
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
               }
            },
            dataType: 'json'
          });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
    });
  }
