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

router.post('/',jwtAuth, jsonParser, (req,res) => {
  const requiredFields = ['number','customer','price', 'item', 'userId'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('rb', req.body);
  console.log('mf', missingField);
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
    Invoice.create({number:req.body.number, date:req.body.date, customer:req.body.customer, item:req.body.item, price:req.body.price, userId:req.user.id})
    .then(invoice => 
      res.status(201).json(invoice.apiRepr()))
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