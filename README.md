# Half_way_locations_recommender
GA WDI Project 3

Halfway location meeting app is for people who want to find an equidistant place to meet. I can be used for study groups, language exchange, dating, meetups, business meetings, etc. This app differs (from the 2 other halfway meeting apps that were found) by allowing users to log in, save/edit their start locations and save/delete selected meeting locations.
This uses Node.js, Express, Google Maps and Yelp APIs, Mongo/Mongoose, Ajax, EJS, HTML, CSS, Bootstrap, Facebook Authentication API and Passport. It is designed mainly with an MVC framework.

Team:

Ken Carrington: Project lead - Google Maps API, Yelp JSON data and Ajax

Eunice Chang: Facebook and Passport Authentication

Nick Hendren: Yelp API

All members worked with Node/Express, Mongo/Mongoose, HTML/CSS/Bootstrap and EJS.


RESTful APIs:

User login: Create, update and delete user
  
Yelp: Get (search for) data
  
Google Maps: Requested map and route
  
Own App's RESTful APIs (from server to client via Ajax): Get user data from DB (isLoggedin, selected start and meeting locations), Get Yelp data via a POST request (to pass in lat/lon and search term), Post user selected to save meeting location to DB

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

3. As a user I want to be able to enter a place type, my location and another location so that the app can find a midpoint and recommended places to meet in that area.

4. As a user I want to be able to change my start locations to wherever I want so that I can use the app anywhere.

5. As a user I want to receive up to 2 recommendations on possible meeting places with other user(s) that are approximately half way between our locations so that we don’t have to think about it too much.


OVER AND ABOVE thenMVP (extra backlog to to later, or if time exists during project week)
1. As a user I want to be able to find more than 2 locations so that I have more choices.

2. As a user I want to be able to select from the recommendations based on various criteria so that we find the ideal meeting spot.

3. As a user I want to be able to adjust the radius of the half way meeting area in order to increase or decrease possible meeting locations.

4. As a user I want to be able to chat with another user so that we can communicate within our meeting app (via socket.io…)

5. As a user I want to be able to read users location as default using Google maps Geo Location api as used in: http://html5demos.com/geo (see code in https://github.com/remy/html5demos/blob/master/demos/geo.html) for more convenience.

6. As a user I want to be able to log in with FB and have it use my home city location as the default start location so that its more convenient.

7. As a user I want to be able to run this app for more than 2 addresses so that a bigger group can use this to meet.

TRACKING ON TRELLO:
https://trello.com/b/mCIDqvBw/halfway-locations-recc

WIREFRAMES

![alt text](http://i.imgur.com/xpB1eTS.png)

Coding Style Guide:
https://github.com/felixge/node-style-guide
