const Joi = require('joi');
const mongoose = require('mongoose');

const Planning = mongoose.model('Planning', new mongoose.Schema({
  name: {
    type:String,
    required: true,
    unique:true
  },
  totalplots: {
    type: Number,
    required: true
  },
  plots: [new mongoose.Schema({
    plotno: String,
    userid: String,
    status: String})],
}));

function validatePlanning(planning) {
  const schema = {
    name: Joi.string().required(),
    totalplots:Joi.number().min(1).max(30).required(),
    plots:Joi.array().items(Joi.object({
      plotno:Joi.string().required(),
      userid:Joi.string().required(),
      status:Joi.string().allow(['  ','Occupied']).required()
    }))
  };

  return Joi.validate(planning, schema);
}  
function validateplanningPlots(planning) {
  const schema = {
    plots:Joi.array().items(Joi.object({
      plotno:Joi.string().required(),
      userid:Joi.string().required(),
      status:Joi.string().allow(['  ','Occupied']).required()
    }))
  };

  return Joi.validate(planning, schema);
}  

exports.Planning = Planning; 
exports.validate = validatePlanning;
exports.validateMarks = validateplanningPlots;