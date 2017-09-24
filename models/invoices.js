const mongoose = require ('mongoose');

const invoiceSchema = mongoose.Schema ({
    id: {type: number, required: true},
    date: {type: date, required: true},
    customer: {type: string, required: true},
    description: {type: string, required: true},
    price: {type: number, required: true},
    quantity: {type: number, required: true}
});

module.exports = {Invoice};