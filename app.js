const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api-routes')
const passport = require('passport');
const cookieSession = require('cookie-session')
const session = require('express-session');
const mongoose = require('mongoose');
const url = require('url');
const database= require('./database');
require('./config/passport-setup');


const app = express();
const api = express();

app.set('view engine', 'jade');
app.set(__dirname, path.join(__dirname, ''));
app.use(express.static(__dirname + '/views'));
app.set('trust proxy', true);


//setting up session with cookies
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))


// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(database.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});


//App Router
app.use("/api",apiRoutes);

// check if user has is Logged In
const isLoggedIn = (req, res, next) => {
    if (req.user){
      next();
    }else{
      res.sendStatus(401);
    }
  }

app.get('*', (req, res)  => {
  if(req.url === '/'){
  const pathn = path.join(__dirname, "views", "index");
  res.render(pathn);
}else if(req.url.includes('/oauth2callback')) {
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res){
    res.redirect('api/good')
  };
}else if (req.url.includes('/good')) {
  isLoggedIn,(req, res) => res.send(`Welcome mr ${req.user.displayName}!`);
}else{
  res.status(400).send("Page not Found");
}
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Sever is listening on ${PORT}`));
