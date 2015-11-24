// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'IsinrwJ_yWacYBFIGPLRoA',
  consumer_secret: 'iwXk1NZWUZg9gNmDZ3g72otxCiI',
  token: 'pLVuUM4Pd8BGLozhQDsjxHWZ5irnL09K',
  token_secret: 'vH7CfxS2POsC10T5GyrqnjNhLuQ',
});

//See http://www.yelp.com/developers/documentation/v2/search_api


//window.onload = function() {
//   $.ajax({
//     url: 'views/yelp',
//     method: 'GET',
//     success: function(data){
//         yelp.search({ term: 'bar', location: '1520 2nd Street, Santa Monica, CA', limit: 10})
//           .then(function (data) {
//             for (var i = 0; i < data.businesses.length; i++){
//               console.log(data.businesses[i].name);
//               console.log(data.businesses[i].url);
//               console.log(data.businesses[i].location);
//             }
//           })
//         .catch(function (err) {
//           console.error(err);
//         });
//     }
//   })
// }

module.exports = yelp;
