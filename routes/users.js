const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate, validateUserPut} = require('../models/user');
const express = require('express');
const router = express.Router();
const arraytotree = require('array-to-tree');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});
/**/
router.get('/tree/:uid',  async (req, res) => {
  const user = User.aggregate([
     {$match: { userid: req.params.uid }},
     {$graphLookup:{
       from: 'users',
       startWith: '$userid',
       connectFromField: 'userid', 
       connectToField: 'sponsorid',
       as: 'connections'
     }}]).exec((err, user) => {
      if (err) throw err;
     
    const connections = user[0].connections;
    const usertree = arraytotree(connections, {parentProperty: 'sponsorid', customID: 'userid'});

    res.send(usertree);
  });

 
});
router.post('/', async (req, res) => {
 const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ userid: req.body.userid });
  if (user) return res.status(400).send('User already registered.');

  user = new User(req.body);
   
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
 
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'userid','uimage']));
});

router.put('/', [auth], async (req, res) => {
  const { error } = validateUserPut(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOneAndUpdate({ userid: req.body.userid},
    { 
      sponsorid: req.body.sponsorid,
      username: req.body.username,
      fname: req.body.fname,
      dob: req.body.dob,
      phone: req.body.phone,
      emailid: req.body.emailid,
      address: req.body.address,
      city: req.body.city,
      aadharno: req.body.aadharno,
      panno: req.body.panno,
      planning: req.body.planning,
      plotno: req.body.plotno,
      bankinfo: req.body.bankinfo,
      nominee: req.body.nominee,
      aadharimage: req.body.aadharimage,
      uimage: req.body.uimage,
      status: req.body.status
    }, { new: true });

  if (!user) return res.status(404).send('The User with the given ID was not found.');
  
  res.send(user);
});

router.put('/pwd', [auth], async (req, res) => {
  let user = await User.findOne({ userid: req.body.userid });
  if (!user) return res.status(400).send('User already registered.');
  
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid  password.');
  const salt = await bcrypt.genSalt(10);
  const newpwd = await bcrypt.hash(req.body.newpassword, salt);
  const user1 = await User.findOneAndUpdate({ userid: req.body.userid},
    { 
      password: newpwd
    }, { new: true });

  if (!user1) return res.status(404).send('The User with the given ID was not found.');
  
  res.send(user1);
});
module.exports = router; 
