//const {Location} = require('../models/location');
//const {Amenity} = require('../models/amenity');
const {Offer} = require('../models/offer');
const {Property, validate} = require('../models/property'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const datefunction = require("add-subtract-date");

router.get('/', async (req, res) => {
  const propertys = await Property.find().sort('name');
  res.send(propertys);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

 // const location = await Location.findById(req.body.locationId);
  //if (!location) return res.status(400).send('Invalid location.');
  //var amenitys=[];
  //for (i=0;i<req.body.amenityId.length;i++){
   //var amenityx = await Amenity.findById(req.body.amenityId[i]);
   //if (!amenitys[i]) return res.status(400).send('Invalid Amenity.');
   //amenitys.push(amenityx);
//}
  const offer = await Offer.findById(req.body.offerId);
  if (!offer) return res.status(400).send('Invalid Offer.');
  function avlclass()  {
    var rdate,
    total,
    avl,
    tariffs,
    tariffd,
    tarifft
  }
  var avls=[];
  var dti = new Date();
  var dt = new Date();
  var dte = new Date();
  dte.setDate(dti.getDate()+10);
   //datefunction.add(dti, 180, "days") //'var dte = dti+180;
  for (dt=dti; dt<=dte;datefunction.add(dt, 1, "day")){
    var avl = new avlclass();
    var newdt = new Date(dt.toString());
    avl.rdate=newdt;
    avl.total=req.body.total;
    avl.avl=req.body.total;
    avl.tariffs=req.body.tariffs;
    avl.tariffd=req.body.tariffd;
    avl.tarifft=req.body.tarifft;
    avls.push(avl);
  }

  let property = new Property({ 
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    description: req.body.description,
    isactive: true,
    locname: req.body.locname,
    amenities: req.body.amenities,
    offer: {
      _id: offer._id,
      name: offer.name,
      discount: offer.discount
    },
    reviews: [{userid:0,stars:0,msg:' '}],
    availability: avls
});
  property = await property.save();
  
  res.send(property);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const property = await Property.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    }, { new: true });

  if (!property) return res.status(404).send('The property with the given ID was not found.');
  
  res.send(property);
});

router.delete('/:id', async (req, res) => {
  const property = await Property.findByIdAndRemove(req.params.id);

  if (!property) return res.status(404).send('The property with the given ID was not found.');

  res.send(property);
});

router.get('/:id', async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) return res.status(404).send('The property with the given ID was not found.');

  res.send(property);
});

router.get('/location/:lnm', async (req, res) => {
  var query = {"locname":req.params.lnm};
  const property = await Property.find(query);

  if (!property) return res.status(404).send('The property with the given ID was not found.');

  res.send(property);
});

router.put('/setinactive/:id', async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id,
    { 
      isactive: false
    }, { new: true });

  if (!property) return res.status(404).send('The property with the given ID was not found.');
  
  res.send(property);
});

router.put('/tariff/:id/:s/:d/:t', async (req, res) => {

  Property.update({"_id" : mongoose.Types.ObjectId(req.params.id)},{$set : {"availability.$[].tariffs":req.params.s,"availability.$[].tariffd":req.params.d,"availability.$[].tarifft":req.params.t}}, {
    sort: {_id: -1}
  }, (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  }
);
});

router.put('/review/:id/:uid/:stars/:msg', async (req, res) => {

  Property.update({"_id" : mongoose.Types.ObjectId(req.params.id)},{$push : { reviews: {"userid":req.params.uid,"stars":req.params.stars,"msg":req.params.msg}}}
  , (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  }
);
});

router.put('/newoffer/:id/:oid', async (req, res) => {
  const offer = await Offer.findById(req.params.oid);
  if (!offer) return res.status(400).send('Invalid Offer.');

  Property.update({"_id" : mongoose.Types.ObjectId(req.params.id)},{$set : {"offer._id":offer._id,"offer.name":offer.name,"offer.discount":offer.discount}}
  , (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  }
);
});


module.exports = router; 