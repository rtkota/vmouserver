const Joi = require('joi');
const mongoose = require('mongoose');

const Property = mongoose.model('Property', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 500
  },
  locname: String,
  address: {
    type: String,
    minlength: 5,
    maxlength: 500
  },
  offer: new mongoose.Schema({
    name: String,
    discount: Number
  }),
  amenities: [String],
  isactive: {type: Boolean,
    default: true
  },
  reviews: [new mongoose.Schema({
    userid: String,
    stars: Number,
    msg: String})],
  availability: [new mongoose.Schema({
    rdate: Date,
    category: String,
    total: Number,
    avl: Number,
    tariffs: Number,
    tariffd: Number,
    tarifft: Number})]
}));

function validateProperty(property) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(500),
    total:Joi.number().min(1).max(500),
    tariffs:Joi.number().min(1).max(100000),
    tariffd:Joi.number().min(1).max(100000),
    tarifft:Joi.number().min(1).max(100000),
    locname:Joi.string(),
    amenities:Joi.array().items(Joi.string()),
    offerId:Joi.string()
  };

  return Joi.validate(property, schema);
}  

exports.Property = Property; 
exports.validate = validateProperty;