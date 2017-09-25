const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//this is endpoint /login/
router.get('/', (req,res) => {
    res.sendFile(__dirname + 'login.html')
});

module.exports = router;