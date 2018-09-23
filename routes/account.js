const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var newcities = require('full-countries-cities');
const bcrypt = require('bcryptjs');

// Load User Model
require('../models/User');
const User = mongoose.model('users');


router.get('/overview', (req, res) => {
  res.render('account/overview');
});
router.get('/history', (req, res) => {
  res.render('account/history');
});
router.get('/profil', (req, res) => {
  res.render('account/profil');
});
router.get('/change-password', (req, res) => {
  res.render('account/change-password');
});

// get cities
router.get('/test/:id', (req, res) => {
  test = req.params.id;
  cities = newcities.getCities(test);
  res.send(cities);
});

//edit profil
router.put('/profil', (req, res) => {
  User.findOne({
    _id: res.locals.user.id
  }).then(user => {
    user.FirstName = req.body.nom;
    user.LastName = req.body.prenom;
    user.email = req.body.email;
    user.telephone = req.body.telephone;
    user.country = req.body.country;
    user.city = req.body.city;
    user.Dateofbirth = req.body.Dateofbirth

    user.save().then(user => {
      res.redirect('/account/overview');
    })
  });
});



//edit password
// router.put('/change-password', (req, res) => {
//   User.findOne({
//     _id: res.locals.user.id
//   }).then(user => {
//     user.FirstName = req.body.nom;
//     user.LastName = req.body.prenom;
//     user.email = req.body.email ;
//     user.telephone = req.body.telephone ;
//     user.country= req.body.country ;
//     user.city= req.body.city ; 
//     user.Dateofbirth= req.body.Dateofbirth

//     user.save().then(user => {
//       res.redirect('/account/overview');
//     })
//   });
// });

// router.post('/mail', (req, res, next) => {
//   passport.authenticate('local', {
//     failureRedirect: '/auth/mail',
//     failureFlash: true,
//     successRedirect: '/'

//   })(req, res, next);
//   // Successful authentication, redirect home.
//   // res.redirect('/');
// });


router.put('/change-password', (req, res) => {
  let errors = [];

  if (req.body.newpassword !== req.body.password2) {
    errors.push({ text: 'Les mots de passe saisis ne sont pas identiques' });
  }

  if (req.body.newpassword.length < 4) {
    errors.push({ text: 'Le mot de passe doit contenir aux moins 4 caractères ' });
  }
  if (errors.length > 0) {
    res.render('account/change-password', {
      errors: errors,
    });
  } else {
    User.findOne({ _id: res.locals.user.id })
      .then(user => {
        if (user) {
          // Match password
          bcrypt.compare(req.body.currentpassword, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
              req.flash('error_msg', 'Désolé, mot de passe incorrect ');
              res.redirect('/account/change-password');
            } else {
              user.password = req.body.newpassword,
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;

                    user.save(function (error) {
                      if (error) {
                        console.log(err);
                        return;
                      }
                      req.flash('success_msg', 'Votre mot de passe a bien ete modifié ');
                      res.redirect('/account/change-password');
                    });



                  });
                });
            }
          })

        }})
  }


});


module.exports = router;