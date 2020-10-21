const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message+"ERRO   R");
  
  let user = await User.findOne({ userid: req.body.userid });
  if (!user) return res.status(400).send('Invalid user');

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send('Invalid  password.');
 
  const token = user.generateAuthToken();
  const usr = {
    userId:user._id,
    userid:user.userid,
    token:token,
    isAdmin:user.isAdmin,
    uimage:user.uimage
  };
  
  res.send(usr);
});

function validate(req) {
  const schema = {
    userid: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
