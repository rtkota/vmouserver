const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Offer, validate} = require('../models/offer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const offers = await Offer.find().sort('name');
  res.send(offers);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let offer = new Offer({ name: req.body.name, discount: req.body.discount });
  offer = await offer.save();
  
  res.send(offer);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const offer = await Offer.findByIdAndUpdate(req.params.id, { name: req.body.name, discount: req.body.discount }, {
    new: true
  });

  if (!offer) return res.status(404).send('The offer with the given ID was not found.');
  
  res.send(offer);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const offer = await Offer.findByIdAndRemove(req.params.id);

  if (!offer) return res.status(404).send('The genre with the given ID was not found.');

  res.send(offer);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) return res.status(404).send('The offer with the given ID was not found.');

  res.send(offer);
});

module.exports = router;