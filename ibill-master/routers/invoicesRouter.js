const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//this is endpoint /dashboard/
router.get('/', (req, res) => {
    res.sendFile(__dirname + 'dashboard.html');
});

//CRUD


module.exports = router;