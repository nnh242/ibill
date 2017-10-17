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

const requiredFields = ['number','customer','price', 'item', 'userId'];

const catchError = (err,res) => {
  console.error(err);
  return res.status(500).json({error: 'Something went wrong'});
}

router.get('/', jwtAuth, (req, res) => {
  Invoice
  .find({'userId': req.user.id})
  .then(invoices => {
      res.json({invoices: invoices.map((invoice => invoice.apiRepr()))
      });
    })
    .catch(catchError);
}); 

function validateInvoiceFields(invoice) {
  const stringFields = ['number','date','customer','item','price','userId'];
  const nonStringField = stringFields.find(
    field => field in invoice && typeof invoice[field] !== 'string'
  );

  if (nonStringField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    };
  }
  return { valid: true };
}

function confirmUniqueNumber(number) {
  return Invoice.find({ number })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Invoice number is already takken',
          location: 'number'
        });
      } else {
        return Promise.resolve();
      }
    });
}

router.post('/', jsonParser, jwtAuth, (req,res) => {
  requiredFields.map((field) => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  })
  
  let invoiceValid = {};
  if (validateInvoiceFields(req.body).valid === true) {
    invoiceValid = req.body;
  } else {
    let code = validateInvoiceFields(req.body).code || 422;
    return res.status(code).json(validateInvoiceFields(req.body));
  }

  let {number, date, customer, item, price, userId} = invoiceValid;
    Invoice.create({number, date, customer, item, price, userId})
    .then(invoice => res.status(201).json(invoice.apiRepr()))
    .catch(catchError);
});

router.get('/:id', jwtAuth, (req, res) => {
  Invoice
  .findById(req.params.id)
  .then(invoice => res.json(invoice.apiRepr()))
  .catch(catchError);
});

router.put('/:id', jwtAuth, (req,res) => {
    if (req.params.id !== req.body.id) {
      console.error('Unmatched id in request and body');
      return res.status(400).send('Unmatched id in request and body');
    }
    const toUpdate = {};
    const updateableFields = ['date','number','customer','item','price']
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    
    Invoice
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(invoice => res.status(200).json(invoice.apiRepr()))
    .catch(catchError);
});

router.delete('/:id', jwtAuth, (req,res) => {
    Invoice
    .findByIdAndRemove(req.params.id)
    .then(invoice => res.status(204).end())
    .catch(catchError)
});

module.exports = router;