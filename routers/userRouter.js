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

const alertError = body => field => {
  if (!(field in body)) {
    const message = `Missing \`${field}\` in request body`
    console.error(message);
    return res.status(400).send(message);
  }
}

const catchError = () => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}
const requiredCredentials = ['email','password']
//CREATE
/* router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['email', 'password','company'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    const user = UsersList.create(req.body.email, req.body.password);
    res.status(201).json(user);
  });
 */
 

router.get('/:id', (req, res) => {
  User
    .findById(req.query.id)
    .then(user => res.json(user.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});


/*
router.put('/:id', jsonParser, (req,res) => {
  const requiredFields = ['email', 'password'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating user \`${req.params.id}\``);
  const updatedUser = UsersList.update({
    "id": req.params.id,
    "email": req.body.email,
    "password": req.body.password
  });
  res.status(204).end();
});
 */

router.delete('/:id', (req,res) => {
  User
  .findByIdAndRemove(req.query.id)
  .then(() => {
    console.log(`Deleted user with id \`${req.params.ID}\``);
    res.status(204).end();  
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went wrong'});
  });
});

module.exports = router;