const mongoose = require ('mongoose');
const uuid = require('uuid');
//schema.. formating, but how to export this schema or to use this schema
//will this help export default mongoose.model('Skeleton', skeletonSchema);
//looked it up online and asked in the QA
const invoiceSchema = mongoose.Schema ({
    number: {type: number, required: true},
    date: {type: date, required: false},
    customer: {type: string, required: true},
    description: {type: string, required: false},
    price: {type: number, required: true},
    quantity: {type: number, required: true}
});
// building an object to keep it out of the router,  for Invoices List to separate from database, hoping router looks cleaner

const InvoicesList = {
    create: function(number,customer,description,price,quantity){
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
        console.log(`Deleting invoice with \`${invoiceId}\``);
        delete this.invoices[invoiceId];
    },
    update:function(updatedInvoice){
        const {id} = updatedInvoice;
        console.log(`Updating invoice with \`${id}\``);
        if (!(id in this.invoices)) {
            throw StorageException(`Can't update invoice \`${id}\` because it does not exist`)
        }
        this.invoices[updatedInvoice.id] = updatedInvoice;
        return updatedInvoice;
    }
}
//volatile in-memory storage - to be replaced by mongoose
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

