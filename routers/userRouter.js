const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//this is endpoint /login/
router.get('/', (req,res) => {
    console.log ('i am at the user router');
    console.log(__dirname);
    res.sendFile( './public/login.html')
});


module.exports = router;