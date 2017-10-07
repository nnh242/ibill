const mongoose = require ('mongoose');

const invoiceSchema = mongoose.Schema ({
    number: {type: Number, required: true},
    date: {type: Date, required: false},
    customer: {type: String, required: true},
    item: {type: String},
    price: {type: Number, required: true}
});


invoiceSchema.methods.apiRepr = function() {
    return {
      id: this._id,
      date: this.date,
      number: this.number,
      customer: this.customer,
      item: this.item,
      price: this.price,
    };
  };
const Invoice = mongoose.model('Invoice', invoiceSchema);
 module.exports = {Invoice};


