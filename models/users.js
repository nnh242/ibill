const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema ({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    company: {type: String, required: true}
});

userSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username,
        password: this.password,
        company: this.company
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