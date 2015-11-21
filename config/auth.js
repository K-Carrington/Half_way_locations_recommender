module.exports = {
	'facebookAuth': {
		'clientID': '1646122078996791',
		'clientSecret': '4d2c6e86c0734cf5e740e7008afe3273',

		//for FB to send user back to here:
		// Need to change config/auth.js, settings on FB site 
		'callbackURL': 'http://localhost:3000/auth/facebook/callback',
		'profileField': ['emails', 'displayName']
 	} 
}