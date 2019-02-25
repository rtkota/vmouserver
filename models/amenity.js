const Joi = require('joi');
const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Amenity = mongoose.model('Amenity', amenitySchema);

function validateAmenity(amenity) {
  const schema = {
    name: Joi.string().min(2).max(50).required()
  };

  return Joi.validate(amenity, schema);
}

exports.amenitySchema = amenitySchema;
exports.Amenity = Amenity; 
exports.validate = validateAmenity;