const mongoose = require('mongoose');
const express = require('express');
const router  = express.Router();
const Brand = require('../models/brand');
const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');
const Order = require('../models/order');

router.post('/product-details/:id/choose-store/:name/create-order' , (req, res, next) => {
  if (!req.user) {
    res.redirect('/signup'); // not logged-in
    return;
  }
    const product = req.params.id;
    const store = req.params.name;
    Order.create({
      user : req.user,
      product : product,
      store : store,
    })
    .then(order => {
      Order.find()
      .then(orders => {
        res.redirect('/review');
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  });


  module.exports = router;