const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const {InvoicesList} = require('../models/invoices');
mongoose.Promise = global.Promise;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });
//this is endpoint /api/invoices
router.post('/', jsonParser, (req,res) => {
  const requiredFields = ['number','customer','price', 'quantity'];
  for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      console.log(field);
       if (!(field in req.body)) {
          const message = `Missing \`${field}\` in request body`
          console.error(message);
          return res.status(400).send(message);
        } 
      } 
      Invoice
        .create({
          number: req.query.number,
          customer: req.query.customer,
          description: req.query.description,
          price: req.query.price,
          quantity: req.query.quantity
        })
        .then(invoice => res.status(201).json(invoice.apiRpr()))
        .catch(err => {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
        });
});
//how to write a get endpoint to retrieve all invoices for one user
// how to add endpoint router/api/invoices/userA 

//this is endpoint /api/invoices/user/:id 
router.get('/:userId/:invoiceId', (req, res) => {
  //how do i pass the user id into this endpoint? User.findOne({'userId':})
  Invoice
  .findById(req.query.id)
  .then(invoice => res.json(invoice.apiRepr()))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went wrong'});
  });
});

//update invoice by id
router.put('/:userId/:invoiceId', jsonParser, (req,res) => {
  const requiredFields = ['number', 'customer','price','quantity', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.query.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  // throwing error: id is not defined
  console.log(`Updating invoice \`${req.params.id}\``);
  const updatedInvoice = InvoicesList.update({
    "id": req.params.id,
    "number": req.body.number,
    "customer": req.body.customer,
    "description": req.body.description,
    "price": req.body.price,
    "quantity": req.body.quantity
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