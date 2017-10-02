const uuid = require('uuid');

const UsersList = {
    create: function(email, password){
        console.log('Creating a new user');
        const user = {
            email: email,
            id: uuid.v4(),
            password: password
          };
          this.items[item.id] = item;
          return item;
    }, 
    get: function() {
        console.log('Retrieving users');
        return Object.keys(this.items).map(key => this.items[key]);
    },
    delete:function(){
        console.log('Deleting user by Id');
    },
    update:function(){
        console.log('Updating User by Id');
    } 
}
//volatile in-memory storage - to be replaced by mongo
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