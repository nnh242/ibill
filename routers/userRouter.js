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
const requiredCredentials = ['username','password','company']
//CREATE
router.post('/', jsonParser, (req, res) => {
  requiredCredentials.map((credential) => {
    if (!(credential in req.body)) {
      const message = `Missing \`${credential}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  })
  const stringFields = ['username', 'password', 'company', 'street','city','state','zipcode'];
  const nonStringField = stringFields.find(field =>
    (field in req.body) && typeof req.body[field] !== 'string'
  );
  if (nonStringField) {
    return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
    });
  }
  if (nonTrimmedField) {
    return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
        min: 1
    },
    password: {
        min: 10,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField]
                  .min} characters long`
            : `Must be at most ${sizedFields[tooLargeField]
                  .max} characters long`,
        location: tooSmallField || tooLargeField
    });
  }
  let {username, password, company = '', street = '', city = '', state = '',zipcode = ''} = req.body;
  company =company.trim();
  street = street.trim();
  city = city.trim();
  state = state.trim();
  zipcode = zipcode.trim();

  return User.find({username})
  .count()
  .then(count => {
      if (count > 0) {
          // There is an existing user with the same username
          return Promise.reject({
              code: 422,
              reason: 'ValidationError',
              message: 'Username already taken',
              location: 'username'
          });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
  })
  .then(hash => {
      return  User
      .create({
        username: req.body.username,
        password: req.body.password,
        company: req.body.company,
        address: {
          street: req.body.address.street,
          city: req.body.address.city,
          state: req.body.address.state,
          zipcode: req.body.address.zipcode
        },
        phone: req.body.phone
      });
  })
  .then(user => {
      return res.status(201).json(user.apiRepr());
  })
  .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
  });
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

module.exports = {router};