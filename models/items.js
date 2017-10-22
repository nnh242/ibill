const mongoose = require ('mongoose');
const itemSchema = mongoose.Schema ({
    number: {type: String, required:true, unique: true},
    customer: {type: String, required: true},
    item: [{type: String, required: true}],
    price:[{type: Number, required: true}],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});


itemSchema.methods.apiRepr = function(item) {
    return {
      id: this._id,
      number: this.number,
      customer: this.customer,
      item: this.item,
      price: this.price,
      userId: this.userId
    };
  };

const Item = mongoose.model('Item', itemSchema);
module.exports = {Item};