const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {InvoicesList} = require('../models/invoices');
//this is endpoint /api/invoices
router.get('/', (req, res) => {
    console.log('app is using invoices router');
    res.json(InvoicesList.get());
});

module.exports = router;