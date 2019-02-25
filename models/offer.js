const Joi = require('joi');
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  discount: {
      type: Number,
      required: true
  }
});

const Offer = mongoose.model('Offer', offerSchema);

function validateOffer(offer) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    discount: Joi.number().min(1).max(100).required()
};

  return Joi.validate(offer, schema);
}

exports.offerSchema = offerSchema;
exports.Offer = Offer; 
exports.validate = validateOffer;