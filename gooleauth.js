const passport = require('passport');
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require('./models/user')
require('dotenv').config();

function googleAuth() {

  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    user.findOrCreate({ googleId: profile.id }, function (err, user) {
  
      return cb(err, user);
    });
  }
));
    
}

module.exports = { googleAuth };
