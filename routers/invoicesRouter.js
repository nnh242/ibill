const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Invoices} = require ('/models/invoices.js')
//create invoice
router.post('/', jsonParser, (req, res) => {
const requiredFields = ['id','customer',,'description','price','quantity'];
for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
    const message = `Missing \`${field}\` in request body`
    console.error(message);
    return res.status(400).send(message);
    }
}
const item = Invoices.create(req.body.customer, req.body.description, req.body.price, req.body.quantity);
res.status(201).json(item);
});
//retrieve invoice
router.get('/', (req, res) => {
    res.json(Invoices.get());
  });

//update invoice by id
router.put('/:id', jsonParser, (req, res) => {
const requiredFields = ['id','customer', 'description', 'price', 'quantity'];
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
console.log(`Updating invoice \`${req.params.id}\``);
const updatedInvoice = Invoices.update({
    id: req.params.id,
    customer: req.body.customer,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity
});
res.status(204).end();
})

//delete invoice by id
router.delete('/:id', (req, res) => {
    Invoices.delete(req.params.id);
    console.log(`Deleted invoice \`${req.params.ID}\``);
    res.status(204).end();
    });

module.exports = router;