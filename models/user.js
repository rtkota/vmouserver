const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  userid: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  sponsorid: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  fname: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  dob: {
    type: Date,
  },
  phone: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 255,
  },
  emailid: {
    type: String,
  },
  address: {
    type: String,
    minlength: 2,
    maxlength: 1024,
  },
  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  aadharno: {
    type: String,
    minlength: 12,
    maxlength: 12,
  },
  panno: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  status: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 8,
  },
  planning: {
    type: String
  },
  plotno: {
    type: String
  },
  bankinfo: [new mongoose.Schema({
    acno: String,
    bankname: String,
    branch: String,
    ifsccode: String,
    holdername:String})],
  nominee: [new mongoose.Schema({
    name: String,
    relation: String,
    dob: Date})],
  aadharimage: { type: String, data: Buffer, contentType: String },
  uimage: { type: String, data: Buffer, contentType: String },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    userid: Joi.string().min(6).max(6).required(),
    password: Joi.string().min(5).max(1024).required(),
    sponsorid: Joi.string().min(6).max(6).required(),
    username: Joi.string().min(2).max(255).required(),
    fname: Joi.string(),
    dob:Joi.date(),
    status: Joi.string().allow(['active','inactive']).required(),
    phone: Joi.string().min(7).max(255).required(),
    emailid:Joi.string().min(3).max(255),
    address:Joi.string().min(2).max(1024),
    city: Joi.string().min(2).max(255).required(),
    aadharno: Joi.string().min(12).max(12),
    panno: Joi.string().min(10).max(10).required(),
    planning: Joi.string(),
    plotno: Joi.string(),
    bankinfo:Joi.object({
      acno:Joi.string(),
      bankname:Joi.string(),
      branch:Joi.string(),
      ifsccode:Joi.string(),
      holdername:Joi.string()
    }),
    nominee:Joi.object({
      name:Joi.string(),
      relation:Joi.string(),
      dob:Joi.date()
    }),
    aadharimage:Joi.binary(),
    uimage:Joi.binary()
  };

  return Joi.validate(user, schema);
}
function validateUserPut(user) {
  const schema = {
    userid: Joi.string().min(6).max(6).required(),
    sponsorid: Joi.string().min(6).max(6).required(),
    username: Joi.string().min(2).max(255).required(),
    fname: Joi.string(),
    dob:Joi.date(),
    status: Joi.string().allow(['active','inactive']).required(),
    phone: Joi.string().min(7).max(255).required(),
    emailid:Joi.string().min(3).max(255),
    address:Joi.string().min(2).max(1024),
    city: Joi.string().min(2).max(255).required(),
    aadharno: Joi.string().min(12).max(12),
    panno: Joi.string().min(10).max(10).required(),
    planning: Joi.string(),
    plotno: Joi.string(),
    bankinfo:Joi.object({
      acno:Joi.string(),
      bankname:Joi.string(),
      branch:Joi.string(),
      ifsccode:Joi.string(),
      holdername:Joi.string()
    }),
    nominee:Joi.object({
      name:Joi.string(),
      relation:Joi.string(),
      dob:Joi.date()
    }),
    aadharimage:Joi.binary(),
    uimage:Joi.binary()
  };

  return Joi.validate(user, schema);

}
exports.User = User; 
exports.validate = validateUser;
exports.validateUserPut = validateUserPut;