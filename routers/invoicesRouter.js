const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const {Invoice} = require('../models/invoices');
mongoose.Promise = global.Promise;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });

const requiredFields = ['number','customer','price', 'item'];

const catchError = (err,res) => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}
//this is endpoint /api/invoices - getting all invoices
/* router.get('/', (req, res) => {
  Invoice
    .find()
    .then(invoices => {
      res.json({
        invoices: invoices.map(
          (invoice) => invoice.apiRepr())
      });
    })
    .catch(catchError);
});  */

//this is api/invoices/user, add an invoice to authenticated user
router.post('/user', jsonParser, jwtAuth, (req,res) => {
  requiredFields.map((field) => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  })
  Invoice
    .find({'user': req.params.id})
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

//this is endpoint gets a specific invoice by id
router.get('/user/:id', jwtAuth, (req, res) => {
  Invoice
  .find({'user': req.params.id})
  .then(Invoice.findById(req.params.id))
  .then(invoice => res.json(invoice.apiRepr()))
  .catch(catchError);
});

router.put('/user/:id', jwtAuth, (req,res) => {
    if (req.query.id !== req.body.id) {
      console.error(message);
      return res.status(400).send(message);
    }
    const toUpdate = {};
    const updateableFields = ['date','number','customer','item','price']
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
router.delete('/:id', jwtAuth, (req,res) => {
    Invoice
    .findByIdAndRemove(req.params.id)
    .then(invoice => res.status(204).end())
    .catch(catchError)
});

module.exports = router;