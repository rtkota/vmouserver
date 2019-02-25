const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Amenity, validate} = require('../models/amenity');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const amenities = await Amenity.find().sort('name');
  res.send(amenities);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let amenity = new Amenity({ name: req.body.name });
  amenity = await amenity.save();
  
  res.send(amenity);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const amenity = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!amenity) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(amenity);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const amenity = await Amenity.findByIdAndRemove(req.params.id);

  if (!amenity) return res.status(404).send('The genre with the given ID was not found.');

  res.send(amenity);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) return res.status(404).send('The genre with the given ID was not found.');

  res.send(amenity);
});

module.exports = router;