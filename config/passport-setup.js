const passport = require('passport');
const fs = require('fs');
const path = require('path');
const ObjectId = require('mongodb').ObjectID;
const rp = require('request-promise');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./user');

const datasource = 'https://www.googleapis.com/fitness/v1/users/me/dataSources';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id.id).then((user) => {
        done(null, user);
    }).catch(err => console.log(err));
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
    User.findById({googleId: profile.id}).then((currentUser) => {
      if (currentUser){
        // check user
        // console.log('user is: ', currentUser);
        done(null, currentUser);
      } else {
      //call fitness api
        url = keys.google.fitnessUrl;
        request.get(datasource).auth(null, null, true, accessToken)
        .then(res=> {
            new User({
              googleId: profile.id,
              username: profile.displayName,
              thumbnail: profile._json.image.url
          }).save().then((newUser) => {
            // console.log(`new user created: ${newUser}`)
            done(null, newUser);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }
    });
  })
);
