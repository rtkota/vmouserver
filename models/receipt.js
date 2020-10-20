const Joi = require('joi');
const mongoose = require('mongoose');

const Receipt = mongoose.model('Receipt', new mongoose.Schema({
  recno: {
    type:Number,
    unique:true
  },
  userid: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amt: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  refno: {
    type: String
  },
  bank: {
    type: String
}
}));

function validateReceipt(receipt) {
  const schema = {
    recno: Joi.number(),
    userid: Joi.string().required(),
    date: Joi.date().required(),
    amt: Joi.number().required(),
    mode:Joi.string().allow(['Cash','Cheque','DD','NEFT','RTGS','IMPS','UPI']).required(),
    refno:Joi.string(),
    bank:Joi.string()
  };

  return Joi.validate(receipt, schema);
}  

exports.Receipt = Receipt; 
exports.validate = validateReceipt;