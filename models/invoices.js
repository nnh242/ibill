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
    create: function(id,number,customer,description,price,quantity){
        console.log('Creating a new invoice');
        //not sure about the below block of code
        /* const invoice ={
            id: 
            number: number,
            customer: customer,
            description: description,
            price: price,
            quantity: quantity
        }
        console.log(invoice); */
    //
    }, 
    get: function() {
        console.log('Retrieving invoices');
        /* return Object.keys(this.items).map(key => this.items[key]); */
    },
    delete:function(){
        console.log('Deleting invoice with number');
    },
    update:function(){
        console.log('Updating invoice with number');
    } 
}
module.exports = {InvoicesList};

