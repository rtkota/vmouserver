const express = require('express');
const amenities = require('../routes/amenities');
const propertys = require('../routes/propertys');
const dayclose = require('../routes/dayclose');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middleware/error');
const locations = require('../routes/locations');
const offers = require('../routes/offers');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/amenities', amenities);
  app.use('/api/propertys', propertys);
  app.use('/api/dayclose', dayclose);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);
  app.use('/api/locations', locations);
  app.use('/api/offers', offers);
  app.use(error);
}