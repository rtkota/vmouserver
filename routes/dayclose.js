const {Property, validate} = require('../models/property'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const datefunction = require("add-subtract-date");

router.put('/', async (req, res) => {
    function avlclass()  {
    var rdate,
    total,
    avl,
    tariffs,
    tariffd,
    tarifft
    }
    const propertys = await Property.find().sort('name');
    propertys.forEach(property => {
        var dt=new Date();
        const avllast = property.availability[property.availability.length-1];
        dt = avllast.rdate;
        var avl = new avlclass();
        datefunction.add(dt, 1, "day")
        var newdt = new Date(dt.toString());
        avl.rdate=newdt;
        avl.total=avllast.total;
        avl.avl=avllast.total;
        avl.tariffs=avllast.tariffs;
        avl.tariffd=avllast.tariffd;
        avl.tarifft=avllast.tarifft;    
        Property.updateOne({"_id":property._id},{$push: {availability:avl}}
            , (err, result) => {
           if (err) return res.send(err)});
    });
    
    Property.updateMany({$pop: {availability:-1}}
      , (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    });
  });
  module.exports = router;