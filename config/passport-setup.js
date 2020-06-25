const passport = require('passport');
const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const datasource = 'https://www.googleapis.com/fitness/v1/users/me/dataSources';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

// google keys for oauth2
const keyPath = path.join(__dirname, '../oauth2.keys.json');
let keys = {redirect_uris: ['']};
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

passport.use(new GoogleStrategy({
    clientID: keys.client_id,
    clientSecret: keys.client_secret,
    callbackURL: keys.redirect_uris[0]
  },(accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if (currentUser){
        // check user
        done(null, currentUser);
      } else {
      //call fitness api
        url = keys.google.fitnessUrl;
        request.get(datasource).auth(null, null, true, accessToken)
        .then(res=> {
            new User({
              googleId: profile.id,
              activity: res
          }).save().then((newUser) => {
          done(null, newUser);
          });
        });
      }
    });
}));
