const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {UsersList} = require('../models/users');
//this is endpoint /api/users
router.get('/', (req,res) => {
    console.log ('i am at the user router');
    res.json(UsersList.get());
});

module.exports = router;