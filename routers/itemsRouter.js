
const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const {Item} = require('../models/items');
mongoose.Promise = global.Promise;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });
//reusable catchError function
const catchError = (err,res) => {
  return res.status(500).json({error: 'Something went wrong'});
}
//this endpoint api/items is protected
router.get('/',jwtAuth, (req, res) => {
  Item
  .find({'userId': req.user.id})
  .then(items => {
      res.json({items: items.map((item => item.apiRepr()))
      });
    })
    .catch(catchError);
}); 
//this is POST endpoint api/items with input validation, no order has the same number
router.post('/',jwtAuth, jsonParser, (req,res) => {
  const requiredFields = ['number','customer','price', 'item', 'userId'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  Item
  .find({number: req.body.number, userId:req.user.id})
  .then( items => { if (items.length > 0) {
    const message ='Number has already been used';
    return res.status(400).send(message);
    }
    else {
      Item.create({number: req.body.number, customer:req.body.customer, item:req.body.item, price:req.body.price, userId:req.user.id})
      .then(item => {
        res.status(201).json(item.apiRepr())})
      .catch((err) => {
        return res.status(500).json({error: 'Something went wrong'});
      })
    }
  })
  .catch((err) => {
    return res.status(500).json({error: 'Something went wrong'});
  });
});
  
//getting an item of the database by item's id api/items/:id
router.get('/:id', jwtAuth, (req, res) => {
  Item
  .findById(req.params.id)
  .then(item => res.json(item.apiRepr()))
  .catch(catchError);
});
//Update ordered item by id
router.put('/:id', jwtAuth, (req,res) => {
    if (req.params.id !== req.body.id) {
      console.error('Unmatched id in request and body');
      return res.status(400).send('Unmatched id in request and body');
    }
    const toUpdate = {};
    const updateableFields = ['customer','item','price']
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    
    Item
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(item => res.status(200).json(item.apiRepr()))
    .catch(catchError);
});
//DELETE end point is /api/items/:id
router.delete('/:id', jwtAuth, (req,res) => {
    Item
    .findByIdAndRemove(req.params.id)
    .then(item => res.status(204).end())
    .catch(catchError)
});

module.exports = router;