const Joi = require('joi');
const mongoose = require('mongoose');

const Scheme = mongoose.model('Scheme', new mongoose.Schema({
  schname: {
    type:String,
    required: true,
    unique:true
  },
  percentage: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
}));

function validateScheme(scheme) {
  const schema = {
    schname: Joi.string().required(),
    percentage: Joi.number.required(),
    level: Joi.number.required()
  };

  return Joi.validate(scheme, schema);
}  

exports.Scheme = Scheme; 
exports.validate = validateScheme;