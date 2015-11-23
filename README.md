# Half_way_locations_recommender
GA WDI Project 3

Halfway location meeting app for study groups, language exchange, dating sites, meetups, etc.
This uses Node.js, Express, Google and Yelp APIs, Mongo/Mongoose, Ajax, EJS, Facebook Authentication, Passport, and JWT.

Technical things that are required to utilize:
Use MongoDB & Node.js/Express to CRUD data.
Produce a RESTful API that exposes Suggested meeting locations (via yelp).
Consume its own API (using AJAX or EJS).
Authenticate users using at least one OAuth provider (passport or bcrypt).
Restrict access to the Creation, Updating & Deletion of resource(s) using an authorization middleware function (JWT).
Be deployed online using Heroku.

Functional Requirements as user stories:
MVP
1. As a user I want to read brief easy to understand instructions on how to use the app.
2. As a user I want to be able to to create an account and log in so that I can use the app and have it remember my information.
3. As a user I want to be able to enter both my location and another location so that the app can find a midpoint and recommend places to meet in that area.
4. As a user I want to be able to change my start location to and from my address or wherever I am or will be so that I can use the app anywhere.
5. As a user I want to receive up to 2 coffee shop recommendations on possible meeting places with other user(s) that are approximately half way between our locations so that we don’t have to think about it too much.


OVER AND ABOVE MVP (extras)
1. As a user I want to be able to find more than 2 locations so that I have more choices.
2. As a user I want to be able to select from the recommendations based on various criteria so that we find the ideal meeting spot.
3. As a user I want to be able to adjust the radius of the half way meeting area in order to increase or decrease possible meeting locations.
4. As a user I want to be able to chat with another user so that we can communicate within our meeting app (via socket.io…)
5. As a user I want to be able to read users location as default using Google maps Geo Location api as used in: http://html5demos.com/geo (see code in https://github.com/remy/html5demos/blob/master/demos/geo.html) for more convenience.
6. As a user I want to be able to log in with FB and have it use my home city location as the default start location so that its more convenient.
7. As a user I want to be able to run this app for more than 2 addresses so that a bigger group can use this to meet.

WIREFRAMES

![alt text](http://i.imgur.com/xpB1eTS.png)
