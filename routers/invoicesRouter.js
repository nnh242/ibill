const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {InvoicesList} = require('../models/invoices');

//added some mock invoices to the invoices list to test get endpoint
InvoicesList.create(1001,'Awesome Company', 'ornaments', 2,50);
InvoicesList.create(1002,'Awesome Company', 'chairs', 100,15);
InvoicesList.create(1003,'Awesome Company', 'tables', 250,5);


//this is endpoint /api/invoices
router.get('/', (req, res) => {
  res.json(InvoicesList.get());
});

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

        const invoice = InvoicesList.create(req.body.number, req.body.customer, req.body.price, req.body.quantity);
        res.status(201).json(invoice);
});
// delete invoice by id , tested successful
router.delete('/:id', (req,res) => {
    InvoicesList.delete(req.params.id);
    console.log(`Deleting invoice with \`${req.params.id}\``);
    res.status(204).end();
});
// update invoice by id
router.put('/:id', jsonParser, (req,res) => {
    const requiredFields = ['number', 'customer','price','quantity', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
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

module.exports = router;