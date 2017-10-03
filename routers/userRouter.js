const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {UsersList} = require('../models/users');
UsersList.create('user_1@email.com','password1');
UsersList.create('user_2@email.com','password_2');
UsersList.create('user_3@email.com','pass3');

//this is endpoint /api/users, get endpoint - tested okay
router.get('/', (req,res) => {
    console.log ('i am at the user router');
    res.json(UsersList.get());
});

// this is posting a new user to endpoint /api/users
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['email', 'password'];
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

router.delete('/:id', (req,res) => {
    UsersList.delete(req.params.id);
    console.log(`Deleting user with \`${req.params.id}\``);
    res.status(204).end();
});

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

module.exports = router;