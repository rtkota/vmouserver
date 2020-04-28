const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const {Batch, validate} = require('../models/batch'); 
const express = require('express');
const router = express.Router();

router.get('/user/:uid', auth, async (req, res) => {
  const batches = await Batch.find().sort('userid');
  res.send(batches);
});

router.get('/:bcd', auth, async (req, res) => { 
  const query = {"batchcode":req.body.batchcode};
  const batch = await Batch.find(query);
  if (batch.length=0) return res.status(400).send('Batch Not Found.');
  res.send(batch);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const query = {"batchcode":req.body.batchcode};
  
  const batch1 = await Batch.find(query);
  if (batch1.length>0) return res.status(400).send('Duplicate Batch / Batch Already Exists.');
  const batch = new Batch(req.body);
  await batch.save();
  
  res.send(batch);
});

router.put('/save/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message+"xxxx");

  const batch = await Batch.findByIdAndUpdate(req.params.id,
    { 
      marks: req.body.marks,
      status: req.body.status
    }, { new: true });

  if (!batch) return res.status(404).send('The batch with the given ID was not found.');
  
  res.send(batch);
});

router.put('/submit/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const batch = await Batch.findByIdAndUpdate(req.params.id,
    { 
      marks: req.body.marks,
      status: req.body.status,
      dtsubmitted: req.body.dtsubmitted
    }, { new: true });

  if (!batch) return res.status(404).send('The batch with the given ID was not found.');
  
  res.send(batch);
});


module.exports = router; 