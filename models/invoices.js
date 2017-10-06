const mongoose = require ('mongoose');

const invoiceSchema = mongoose.Schema ({
    number: {type: Number, required: true},
    date: {type: Date, required: false},
    customer: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    total: {type: Number}
});

//this virtual for total amount is not tested
invoiceSchema.virtual('totalAmt').get(function() {
    const totalCalucated = (price,quantity) => {
        return price*quantity;
    }
    return `$ ${totalCalculated}`;
});

invoiceSchema.methods.apiRepr = function() {
    return {
      id: this.id,
      number: this.number,
      customer: this.customer,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      total: this.totalAmt
    };
  };
const Invoice = mongoose.model('Invoice', invoiceSchema);
 module.exports = {Invoice};


