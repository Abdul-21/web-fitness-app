const router = require('express').Router();
const passport = require('passport');

// check if user has is Logged In
const isLoggedIn = (req, res, next) => {
    if (req.user){
      next();
    }else{
      res.sendStatus(401);
    }
  }

router.get("/fitnessAuth",passport.authenticate('google',{scope: ['profile', 'email','https://www.googleapis.com/auth/fitness.body.read','https://www.googleapis.com/auth/fitness.activity.write']}));
router.get("/fitnessAuth/redirect", passport.authenticate('google'), (req, res) => {
    res.send(req.user);
    console.log(req);
    // res.redirect('api/good');
});
router.get("/good", isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

module.exports = router;
