const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const key = require('./keys');
const bcrypt = require('bcryptjs');


// load user model
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: key.googleClientID,
      clientSecret: key.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
      const newUser = {
        googleID: profile.id,
        FirstName: profile.name.givenName,
        LastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
      }

      // Check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if (user) {
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    }));
  passport.use(
       new LocalStrategy({usernameField:'email'} , (email,password,done) => {
      // Check for existing user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          // Return user
         return done(null, false,{message: 'Email introuvable'});
        } 
        // Match password
        bcrypt.compare(password, user.password,(err, isMatch)=> {
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false,{message: 'mot de passe incorrect '});
          }
        })
      })
    }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}

//