const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema ({
    username: {type: String, required: true, unique: true},
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
    return {
        id: this._id,
        username: this.username,
        password: this.password,
        company: this.company,
        address: this.addressString,
        phone: this.phone
    }
  };

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User',userSchema);

module.exports = {User};