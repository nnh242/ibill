const mongoose = require ('mongoose');

const invoiceSchema = mongoose.Schema ({
    number: {type: Number, required: true},
    date: {type: Date, required: false},
    customer: {type: String, required: true},
    item: [{type: String, required: true}],
    price:[{type: Number, required: true}],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


invoiceSchema.methods.apiRepr = function(invoice) {
    return {
      id: this._id,
      date: this.date,
      number: this.number,
      customer: this.customer,
      item: this.item,
      price: this.price,
      userId: this.userId
    };
  };
const Invoice = mongoose.model('Invoice', invoiceSchema);
 module.exports = {Invoice};


