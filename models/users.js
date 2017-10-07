const mongoose = require ('mongoose');

const userSchema = mongoose.Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true},
    company: {type: String, required: true},
    address: {
        number: String,
        street: String,
        city: String,
        state: String,
        zipcode: String
      },
    phone: {type: String}
});

userSchema.virtual('addressString').get(function() {
    const {number, street, city, state, zipcode} = this.address;
    return `${number} ${street} ${city} ${state} ${zipcode}`.trim()});

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
userSchema.methods.validatePassword = function (password) {
return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
return bcrypt.hash(password, 10);
};
const User = mongoose.model('User',userSchema);

module.exports = {User};