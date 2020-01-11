const express = require('express');
const router  = express.Router();
const passport = require("passport");

const User = require("../models/user");


const bcrypt = require("bcrypt");
const bcryptSalt = 10;


/* GET home page */

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup' , (req , res , next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname; 
  const password = req.body.password;
  const username = req.body.username;
  const phonenumber = req.body.phonenumber;
  const street = req.body.street;
  const zipcode = req.body.zipcode;
  const city = req.body.city;
  const country = req.body.country;

  if (firstname === "" || lastname === "" || username === "") {
    res.render('auth/signup' , {errorMessage: "Veuillez entrer un nom, prénom, adresse mail"})
    return;
  }

  User.findOne({username})
  .then(user => {
    if (user) {
      res.render('auth/signup' , {errorMessage: "Un utilisateur est déjà enregistré avec cette email"})
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    User.create({
      firstname : firstname,
      lastname : lastname,
      password : hashPass,
      username : username,
      phonenumber : phonenumber,
      street : street,
      zipcode : zipcode,
      city : city,
      country : country,
    }) 
    .then(user => {
      res.redirect('/')
    })
    .catch(err => next(err))
    
  })
})

router.get("/login", (req, res, next) => {
  res.render("auth/login" , { "errorMessage": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash : true
}));

//ROUTE POUR GOOGLE

router.get("/auth/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}));
router.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/private",
  failureRedirect: "/login"
}));

//ROUTE POUR FACEBOOK

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    successRedirect: '/private',
    failureRedirect: '/login' }));


module.exports = router;