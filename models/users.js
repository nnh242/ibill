const uuid = require('uuid');

const UsersList = {
    create: function(email, password){
        console.log('Creating a new user');
        const user = {
            id: uuid.v4(),
            email: email,
            password: password
          };
          this.users[user.id] = user;
          return user;
    }, 
    get: function() {
        console.log('Retrieving users');
        return Object.keys(this.users).map(key => this.users[key]);
    },
    delete:function(userId){
        console.log('Deleting user by userId');
        delete this.users[userId];
    },
    update:function(updatedUser){
        const {id} = updatedUser;
        console.log(`Updating user with \`${id}\``);
        if (!(id in this.users)) {
            throw StorageException(`Can't update user \`${id}\` because it does not exist`)
        }
        this.users[updatedUser.id] = updatedUser;
        return updatedUser
    } 
}
//volatile in-memory storage - to be replaced by mongoose
function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
 }
function createUsersList() {
    const storage = Object.create(UsersList);
    storage.users = {};
    return storage;
}
module.exports = {UsersList: createUsersList()}