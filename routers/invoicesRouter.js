const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const {InvoicesList} = require('../models/invoices');
mongoose.Promise = global.Promise;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });
//this is endpoint /api/invoices
const requiredFields = ['number','customer','price', 'item'];

const alertError = body => field => {
  if (!(field in body)) {
    const message = `Missing \`${field}\` in request body`
    console.error(message);
    return res.status(400).send(message);
  }
}

const catchError = () => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}

router.post('/', jsonParser, (req,res) => {
  const {number, date, customer, item, price} = req.query;
  requiredFields.map(alertError(req.body))
  Invoice
    .create({
      number,
      date,
      customer,
      item,
      price
    })
    .then(invoice => res.status(201).json(invoice.apiRpr()))
    .catch(catchError);
});

//how to write a get endpoint to retrieve all invoices for one user
// how to add endpoint router/api/invoices/userA
//how do i pass the user id into this endpoint? User.findOne({'userId':})

//this is endpoint gets a specific invoice by id
router.get('/:id', (req, res) => {
  Invoice
  .findById(req.query.id)
  .then(invoice => res.json(invoice.apiRepr()))
  .catch(catchError);
});

//update invoice by id
router.put('/:userId/:invoiceId', jsonParser, (req,res) => {
  const findRequiredFields = [...requiredFields, 'id'];
  findRequiredFields.map(alertError(req.body))
  if (req.query.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating invoice \`${req.params.id}\``);
  const updatedInvoice = InvoicesList.update({
    "id": req.params.id,
    "number": req.body.number,
    "customer": req.body.customer,
    "item": req.body.item,
    "price": req.body.price
  });
  res.status(204).end();
});

// delete invoice by id , tested successful
router.delete('/:id', (req,res) => {
    InvoicesList.delete(req.params.id);
    console.log(`Deleting invoice with \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;