const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ userid: req.body.userid });
  if (!user) return res.status(400).send('Invalid user or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  const usr = {
    userId:user._id,
    userid:user.useid,
    token:token,
    uimage:user.uimage
  };
  
  res.send(usr);
});

function validate(req) {
  const schema = {
    userid: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    uimage:Joi.binary()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
