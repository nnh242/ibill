//const mongoose = require ('mongoose');

/*const invoiceSchema = mongoose.Schema ({
    id: {type: number, required: true},
    date: {type: date, required: true},
    customer: {type: string, required: true},
    description: {type: string, required: true},
    price: {type: number, required: true},
    quantity: {type: number, required: true}
});*/
// building a model for Invoices List to separate from database
const uuid = require('uuid');
const InvoicesList = {
    create: function(number,customer,description,price,quantity){
        console.log('Creating a new invoice');
        const invoice ={
        id: uuid.v4(),
        number: number,
        customer: customer,
        description: description,
        price: price,
        quantity: quantity
        };
        this.invoices[invoice.id] = invoice;
        return invoice;
    }, 
    get: function() {
        console.log('Retrieving invoices');
        return Object.keys(this.invoices).map(key => this.invoices[key]);
    },
    delete:function(invoiceId){
        console.log('Deleting invoice with id');
    },
    update:function(){
        console.log('Updating invoice with id');
    } 
}
//volatile in-memory storage - to be replaced by mongo
function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
 }
function createInvoicesList() {
  const storage = Object.create(InvoicesList);
  storage.invoices = {};
  return storage;
}
module.exports = {InvoicesList: createInvoicesList()}

