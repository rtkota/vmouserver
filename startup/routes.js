const express = require('express');
const receipt = require('../routes/receipt');
const incentive = require('../routes/incentive');
const planning = require('../routes/planning');
const scheme = require('../routes/scheme');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');


module.exports = function(app) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With, Content-Type, Accept, x-auth-token");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS")
    next();
  });
  app.use(express.json());
  app.use('/api/receipt', receipt);
  app.use('/api/incentive', incentive);
  app.use('/api/planning', planning);
  app.use('/api/scheme', scheme);
  app.use('/api/users', users);
  app.use('/api/auth', auth);

  app.use(error);
}