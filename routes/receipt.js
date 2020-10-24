const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {Receipt, validate} = require('../models/receipt');
const {Incentive} = require('../models/incentive');
const {Scheme} = require('../models/scheme');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let query = {"userid":req.body.userid, "status":"active"};
    let user = await User.findOne(query);
    if (!user) return res.status(400).send('User NOT registered OR Inactive');
    
    let receipt = await Receipt.findOne().sort({recno:-1}).limit(1);
    let newrecno = 1;
    if (receipt) newrecno=receipt.recno+1;
    receipt = new Receipt({
        recno:newrecno,
        userid:req.body.userid,
        date: req.body.date,
        amt: req.body.amt,
        mode: req.body.mode,
        refno: req.body.refno,
        bank: req.body.bank
    });
    receipt = await receipt.save();
    const incobj = {
      sid:user.sponsorid,
      date: req.body.date,
      recno: newrecno,
      itype:'Direct',
      amt: req.body.amt,
      planlevel:1
    }
    calcIncentive(incobj);
    res.send(receipt);
  });
    

  const  calcIncentive = async (incobj) => {
    let tds,psaving,netamt,gross;
    let query = {"userid":incobj.sid, "status":"active"};
    let user = await User.findOne(query);
  
    if (!user) return;
    
    if (incobj.itype === 'Direct') 
      gross = incobj.amt*.05;
    else
    {
      let query = {"level":incobj.planlevel};
      let scheme = await Scheme.findOne(query);
      if (!scheme) return;
      gross = incobj.amt * scheme.percentage;
    }
    tds = gross*.10;
    psaving = gross*.10;
    netamt = gross-tds-psaving;
    let incentive = new Incentive({
      recno : incobj.recno,
      date : incobj.date,
      type: incobj.itype,
      userid: incobj.sid,
      gross: gross,
      tds: tds,
      psaving: psaving,
      netamt: netamt,
      status:'Due'
    });
    incentive = await incentive.save();
    const incobj1 = {
      sid:(incobj.itype==='Direct')?incobj.sid:user.sponsorid,
      date: incobj.date,
      recno: incobj.recno,
      itype:'Plan',
      amt: incobj.amt,
      planlevel:(incobj.itype==='Direct')?incobj.planlevel:incobj.planlevel+1
    }
    
    calcIncentive(incobj1);
  }
                                                                                               
                                                                   
  
  router.put('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const receipt = await Receipt.findOneAndUpdate({recno : req.body.recno},
      { 
        date: req.body.date,
        mode: req.body.mode,
        refno: req.body.refno,
        bank: req.body.bank
      }, { new: true });
  
    if (!receipt) return res.status(404).send('The receipt with the given No was not found.');
    
    res.send(receipt);
  });
  
  router.delete('/:recno', async (req, res) => {
    let incentive = await Incentive.find({recno: req.params.recno, status:'Paid'});
    if (incentive) return res.status(404).send('The Incentive of this receipt is already Paid. Cannot Delete');
    const receipt = await Receipt.findAndRemove({recno: req.params.recno});
    if (!receipt) return res.status(404).send('The receipt with the given ID was not found.');
    incentive = await Incentive.findAndRemove({recno: req.params.recno});
    
    res.send(receipt);
  });
  
  
  
  router.get('/user/:uid', async (req, res) => {
    const receipts = await Receipt.find({userid: req.params.uid}).sort({date:1});
  
    if (!receipts) return res.status(404).send('The receipts of this user was not found.');
  
    res.send(receipts);
  });

  router.get('/dates', async (req, res) => {
    var d1 = new Date(req.body.sdate);
    var d2 = new Date(req.body.edate);

    const receipts = await Receipt.find({date: {$gte: d1, $lte: d2}})
    .sort({date:1, recno:1});
  
    if (!receipts) return res.status(404).send('The receipts of this date range was not found.');
  
    res.send(receipts);
  });

  router.get('/:id', async (req, res) => {
    const receipt = await Receipt.findById(req.params.id);
  
    if (!receipt) return res.status(404).send('The receipt with the given ID was not found.');
  
    res.send(receipt);
  }); 
module.exports = router; 