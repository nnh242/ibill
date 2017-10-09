const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const {Invoice} = require('../models/invoices');
mongoose.Promise = global.Promise;
const passport = require('passport');

const requiredFields = ['number','customer','price', 'item'];

const catchError = (err,res) => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}
//this is endpoint /api/invoices - getting all invoices
router.get('/', (req, res) => {
  Invoice
    .find()
    .then(invoices => {
      res.json({
        invoices: invoices.map(
          (invoice) => invoice.apiRepr())
      });
    })
    .catch(catchError);
}); 

//this is endpoint gets a specific invoice by id
router.get('/:id', (req, res) => {
  Invoice
  .findById(req.params.id)
  .then(invoice => res.json(invoice.apiRepr()))
  .catch(catchError);
});

router.post('/', (req,res) => {
  requiredFields.map((field) => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  })
  Invoice
    .create({
      number: req.body.number,
      date: req.body.date,
      customer: req.body.customer,
      item: req.body.item,
      price: req.body.price
    })
    .then(invoice => res.status(201).json(invoice.apiRepr()))
    .catch(catchError);
});

//how to write a get endpoint to retrieve all invoices for one user
// how to add endpoint router/api/invoices/userA
//how do i pass the user id into this endpoint? User.findOne({'userId':})


//update invoice by id
router.put('/:id', (req,res) => {
  /* const findRequiredFields = [...requiredFields, 'id'];
  findRequiredFields.map(alertError => {
    if (!(field in body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    } */
    if (req.query.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    const toUpdate = {};
    const updateableFields = ['date','customer','item','price']
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    
    Invoice
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(invoice => res.status(200).end())
    .catch(catchError);
});

// delete invoice by id , tested successful
router.delete('/:id', (req,res) => {
    Invoice
    .findByIdAndRemove(req.params.id)
    .then(invoice => res.status(204).end())
    .catch(catchError)
});

module.exports = router;