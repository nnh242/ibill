const express = require('express');
const router = express.Router();
const {User} = require('../models/users');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });


const catchError = (err,res) => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}

function validateUserFields(user) {
  const stringFields = ['username', 'password', 'company'];
  const nonStringField = stringFields.find(
    field => field in user && typeof user[field] !== 'string'
  );

  if (nonStringField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    };
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => user[field].trim() !== user[field]
  );

  if (nonTrimmedField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    };
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 10, max: 72 }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    user[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    user[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    };
  }

  return { valid: true };
}

function confirmUniqueUsername(username) {
  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already takken',
          location: 'username'
        });
      } else {
        return Promise.resolve();
      }
    });
}
//api/users/register endpoint
//CREATE
router.post('/register', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'company'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('rb', req.body);
  console.log('mf', missingField);
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let userValid = {};
  if (validateUserFields(req.body).valid === true) {
    userValid = req.body;
  } else {
    let code = validateUserFields(req.body).code || 422;
    return res.status(code).json(validateUserFields(req.body));
  }

  let { username, password, company, address, phone} = userValid;

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({ username, password: hash, company, address, phone});
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
        return res.status(err.code).json(err);
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

//get user by id
router.get('/:id', jwtAuth, (req, res) => {
  User
    .findById(req.params.id)
    .then(user => res.json(user.apiRepr()))
    .catch(catchError);
});

//update user by id 
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['company'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

 User
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(invoice => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//delete user by id
router.delete('/:id', jwtAuth, (req,res) => {
  User
  .findByIdAndRemove(req.params.id)
  .then(user =>res.status(204).end())  
  .catch(catchError);
});

module.exports = router;