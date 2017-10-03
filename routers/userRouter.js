const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {UsersList} = require('../models/users');
UsersList.create('user_1@email.com','password1');
UsersList.create('user_2@email.com','password_2');
UsersList.create('user_3@email.com','pass3');
// this is posting a new user to endpoint /api/users
router.post('/', jsonParser, (req, res) => {
    // when this block runs the message is Missing the first field, either email or password, tested with both and neither and one of each... same message of missing the first one in array
    /* const requiredFields = ['email', 'password'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    } */
    const user = UsersList.create(req.body.email, req.body.password);
    res.status(201).json(user);
    // this block runs but only a new id is posted, email and password are not there... 
  });

//this is endpoint /api/users, get endpoint - tested okay
router.get('/', (req,res) => {
    console.log ('i am at the user router');
    res.json(UsersList.get());
});
// delete endpoint by userID  - tested okay
router.delete('/:id', (req,res) => {
    UsersList.delete(req.params.id);
    console.log(`Deleting user with \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;