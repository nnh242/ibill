const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//this is endpoint /invoices/
router.get('/', (req, res) => {
    res.json();
});

//CRUD


module.exports = router;