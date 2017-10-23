const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const {User} = require('../models/users');
const {app, runServer, closeServer} = require('../server');
const{TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedUserData() {
    console.info('seeding user data');
    const seedData = [];
    for(let i=1; i<=10;i++){seedData.push(generateUserData());}
    return User.insertMany(seedData);
}

function generateUserData(){
    return {
        company: faker.company.name(),
        username: faker.internet.user_name(),
        password: faker.internet.password(10),
        address: {
            street: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(),
            zipcode: faker.address.zip()
        },
        phone: faker.phoneNumber.cell_phone()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Users API resource', function() {
        before(function() {
        return runServer(TEST_DATABASE_URL);
      });
    
      beforeEach(function() {
        return seedRestaurantData();
      });
    
      afterEach(function() {
        return tearDownDb();
      });
    
      after(function() {
        return closeServer();
      })
    describe('GET endpoint', function() {
    it('should return all existing users', function() {
        let res;
        return chai.request(app)
            .get('/api/users')
            .then(function(_res) {
            res = _res;
            res.should.have.status(200);
            res.body.users.should.have.length.of.at.least(1);
            return User.count();
            })
            .then(function(count) {
            res.body.Users.should.have.length.of(count);
            });
        });
    });
    //post endpoint
    //put endpoint
    describe('DELETE endpoint', function() {
        it('delete user by id', function() {
    
            let user;
    
            return User
            .findOne()
            .then(function(_user) {
                user = _user;
                return chai.request(app).delete(`/api/users/${user.id}`);
            })
            .then(function(res) {
                res.should.have.status(204);
                return User.findById(user.id);
            })
            .then(function(_user) {
                should.not.exist(_user);
            });
        });
    });
}); */