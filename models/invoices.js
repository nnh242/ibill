const mongoose = require ('mongoose');

const invoiceSchema = mongoose.Schema ({
    number: {type: Number, required: true},
    date: {type: Date, required: false},
    customer: {type: String, required: true},
    item: {type: String},
    price: {type: Number, required: true}
});

invoiceSchema.methods.apiRepr = function() {
    const {date,number,customer,item,price, id: _id} =this
    return {
      id,
      date,
      number,
      customer,
      item,
      price
    };
  };
const Invoice = mongoose.model('Invoice', invoiceSchema);
 module.exports = {Invoice};


