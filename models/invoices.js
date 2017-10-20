const mongoose = require ('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const invoiceSchema = mongoose.Schema ({
    number: {type: Number},
    date: {type: Date, required: true},
    customer: {type: String, required: true},
    item: [{type: String, required: true}],
    price:[{type: Number, required: true}],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
var connection = mongoose.createConnection('mongodb://localhost/ibill-app');
autoIncrement.initialize(connection);

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
invoiceSchema.plugin(autoIncrement.plugin,{model:'Invoice', field:'number', startAt: 1, incrementBy: 1});
const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = {Invoice};