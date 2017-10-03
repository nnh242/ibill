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
    update:function(){
        console.log('Updating User by Id');
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