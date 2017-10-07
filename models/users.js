const mongoose = require ('mongoose');

const userSchema = mongoose.Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true},
    company: {type: String, required: true},
    address: {
        street: String,
        city: String,
        state: String,
        zipcode: String
      },
    phone: {type: String}
});

userSchema.virtual('addressString').get(function() {
    const {street, city, state, zipcode} = this.address;
    return `${street} ${city} ${state} ${zipcode}`.trim()});

userSchema.methods.apiRepr = function() {
    const {email, password, company, phone, address: addressString, id: _id} = this;
    return {
        id,
        email,
        password,
        company,
        address,
        phone
    }
  };

const User = mongoose.model('User',userSchema);

module.exports = {User};