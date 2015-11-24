// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'IsinrwJ_yWacYBFIGPLRoA',
  consumer_secret: 'iwXk1NZWUZg9gNmDZ3g72otxCiI',
  token: 'pLVuUM4Pd8BGLozhQDsjxHWZ5irnL09K',
  token_secret: 'vH7CfxS2POsC10T5GyrqnjNhLuQ',
});

module.exports = yelp;
