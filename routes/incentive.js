const auth = require('../middleware/auth');
const {Incentive, validate} = require('../models/incentive');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let query = {"userid":req.body.userid, "status":"active"};
    let user = await User.findOne(query);
    if (!user) return res.status(400).send('User NOT registered OR Inactive');

    let incentive = new Incentive({
            userid: req.body.userid,
            date: req.body.date,
            type: req.body.type,
            recno: req.body.recno,
            gross: req.body.gross,
            tds: req.body.tds,
            psaving:req.body.psaving,
            netamt: req.body.netamt,
            status: 'Due'
    })
    incentive = await incentive.save();
    res.send(incentive);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const incentive = await Incentive.findByIdAndUpdate(req.params.id,
      { 
        userid: req.body.userid,
        date: req.body.date,
        type: req.body.type,
        recno: req.body.recno,
        gross: req.body.gross,
        tds: req.body.tds,
        psaving:req.body.psaving,
        netamt: req.body.netamt,
        status: req.body.status,
        paydate: req.body.paydate
      }, { new: true });
  
    if (!incentive) return res.status(404).send('The Incentive with the given No was not found.');
    
    res.send(incentive);
  });
  
  router.delete('/:id', async (req, res) => {
    let incentive = await Incentive.find({_id: req.params.id, status:'Paid'});
    if (incentive) return res.status(404).send('This Incentive is already Paid. Cannot Delete');
     incentive = await Incentive.findByIdAndRemove(req.params.id);
    if (!incentive) return res.status(404).send('The incentive with the given ID was not found.');

    res.send(incentive);
  });
  
  
  
  router.get('/user/:uid', async (req, res) => {
    const incentives = await Incentive.find({userid: req.params.uid}).sort({date:1});
  
    if (!incentives) return res.status(404).send('The incentives of this user was not found.');
  
    res.send(incentives);
  });

  router.get('/dates', async (req, res) => {
    var d1 = new Date(req.body.sdate);
    var d2 = new Date(req.body.edate);

    const incentives = await Incentive.find({date: {$gte: d1, $lte: d2}})
    .sort({date:1, recno:1});
  
    if (!incentives) return res.status(404).send('The incentives of this date range was not found.');
  
    res.send(incentives);
  });
  
  router.get('/:id', async (req, res) => {
    const incentive = await Incentive.findById(req.params.id);
  
    if (!incentive) return res.status(404).send('The incentive with the given ID was not found.');
  
    res.send(incentive);
  }); 

module.exports = router; 