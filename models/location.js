const Joi = require('joi');
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  }
});

const Location = mongoose.model('Location', locationSchema);

function validateLocation(location) {
  const schema = {
    locname: Joi.string().min(2).max(50).required()
  };

  return Joi.validate(location, schema);
}

exports.locationSchema = locationSchema;
exports.Location = Location; 
exports.validate = validateLocation;