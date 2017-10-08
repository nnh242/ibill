const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

const {User} = require('../models/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });


const catchError = (err,res) => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}
const requiredCredentials = ['email','password','company']
//CREATE
router.post('/', (req, res) => {
  requiredCredentials.map((credential) => {
    if (!(credential in req.body)) {
      const message = `Missing \`${credential}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  })
    User
    .create({
      email: req.body.email,
      password: req.body.password,
      company: req.body.company,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        zipcode: req.body.address.zipcode
      },
      phone: req.body.phone
    })
    .then(user=> res.status(201).json(user.apiRepr()))
    .catch(catchError);
  });

router.get('/', (req, res) => {
  User
    .find()
    .then(users => {
      res.json({
        users: users.map(
          (user) => user.apiRepr())
      });
    })
    .catch(catchError);
}); 

router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => res.json(user.apiRepr()))
    .catch(catchError);
});

router.put('/:id', (req,res) => {
  if (req.query.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  const toUpdate = {};
  const updateableFields = ['password','company','item','street','city','state','zipcode']
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  
  User
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(user => res.status(200).end())
  .catch(catchError);
});

router.delete('/:id', (req,res) => {
  User
  .findByIdAndRemove(req.params.id)
  .then(user =>res.status(204).end())  
  .catch(catchError);
  });

module.exports = router;