const Joi = require('joi');
const mongoose = require('mongoose');

const Incentive = mongoose.model('Incentive', new mongoose.Schema({
  userid: {
    type:String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  recno: {
    type: Number,
    required: true
  },
  gross: {
    type: Number,
    required: true
  },
  tds: {
    type: Number,
    required: true
  },
  psaving: {
    type: Number,
    required: true
  },
  netamt: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  paydate: {
      type: Date
  }
}));

function validateIncentive(incentive) {
  const schema = {
    userid: Joi.string().required(),
    date: Joi.date().required(),
    type: Joi.string().allow(['Direct','Plan']).required(),
    recno: Joi.string().min(5).max(6).required(),
    gross:Joi.number().required(),
    tds:Joi.number().required(),
    psaving:Joi.number().required(),
    netamt:Joi.number().required(),
    status:Joi.string().allow(['Due','Paid']).required(),
    paydate:Joi.date()
    }
  };

  return Joi.validate(incentive, schema);
}  

exports.Incentive = Incentive; 
exports.validate = validateIncentive;