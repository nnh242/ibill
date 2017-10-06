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
    return `${this.address.number} ${this.address.street}
    ${this.address.city} ${this.address.state} ${this.address.zipcode}`.trim()});

userSchema.methods.apiRepr = function() {
    return {
    id: this._id,
    email: this.email,
    password: this.email,
    company: this.company,
    address: this.addressString,
    phone: this.phone
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