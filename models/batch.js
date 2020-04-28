const Joi = require('joi');
const mongoose = require('mongoose');

const Batch = mongoose.model('Batch', new mongoose.Schema({
  batchcode: {
    type:String,
    required: true,
    unique:true
  },
  userid: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  exam: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 6
  },
  pcode: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  ccode: {
    type: String,
    minlength: 3,
    maxlength: 500,
    required: true
  },
  ptype: {
    type: String,
    minlength: 2,
    maxlength: 2,
    required: true
  },
  totalcopies: {
    type: Number,
    min:1,
    max:30,
    required: true
  },
  dtcreated: {
    type: Date
  },
  dtsubmitted: {
    type: Date
  },
  status: {
    type: String,
    required: true
  },
  marks: [new mongoose.Schema({
    controlno: Number,
    award: Number,
    status: String})],
}));

function validateBatch(batch) {
  const schema = {
    batchcode: Joi.string().required(),
    userid: Joi.objectId().required(),
    status: Joi.string().allow(['created','saved','submitted']).required(),
    exam: Joi.string().min(5).max(6).required(),
    pcode:Joi.string().min(3).max(50).required(),
    ccode:Joi.string().min(3).max(50).required(),
    ptype:Joi.string().min(2).max(2).allow(['TE','ES','PJ','PV']).required(),
    totalcopies:Joi.number().min(1).max(30).required(),
    dtcreated:Joi.date(),
    dtsubmitted:Joi.date(),
    type:Joi.string().allow(['marks1','marks2','reval1','reval2']).required(),
    marks:Joi.array().items(Joi.object({
      controlno:Joi.number().required(),
      award:Joi.number().required(),
      status:Joi.string().allow(['  ','Ab','UM','ZE']).required()
    }))
  };

  return Joi.validate(batch, schema);
}  

exports.Batch = Batch; 
exports.validate = validateBatch;