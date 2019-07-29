const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();
const {app, runServer, closeServer} = require('../server');
chai.use(chaiHttp);
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const {Item} = require('../models/items');

const {TEST_DATABASE_URL} = require('../config');
let test_token = "";

function seedItemData() {
  console.info('seeding item data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateTestItem());
  }
  
  return Item.insertMany(seedData);
}

function generateTestItem() {
  return {
    number: faker.random.number({min:1}),
    customer: faker.company.companyName(),
    item: faker.random.words(),
    price: faker.commerce.price(),
    userId: userId
  }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Items API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
      return chai.request(app)
          .post('/api/users/register')
          .send({username:"testB", password:"1234567890", company:"TestB"})
          .then(function(res) {
            userId = res.body.id; 
            console.log(userId);
            return chai.request(app).post('/api/auth/login')
                     .send({username:"testB", password:"1234567890"})
                     .then(function(res){test_token = res.body.authToken;})})
          .then(function(){return seedItemData()});
    });
  
  afterEach(function() {
    return tearDownDb(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should return all existing items', function() {
      let res;
      return chai.request(app)
        .get('/api/items')
        .set('Authorization', `Bearer ${test_token}`)
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.items.should.have.length.of.at.least(1);
          return Item.count();
        })
        .then(function(count) {
          console.log(res.body);
          res.body.items.should.have.lengthOf(count);
        });
    });

    it('should return items with right fields', function() {
      let resItem;
      return chai.request(app)
        .get('/api/items')
        .set('Authorization', `Bearer ${test_token}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.items.should.be.a('array');
          res.body.items.should.have.length.of.at.least(1);

          res.body.items.forEach(function(item) {
            item.should.be.a('object');
            item.should.include.keys(
              'id', 'number', 'customer', 'item', 'price', 'userId');
          });
          resItem = res.body.items[0];
          return Item.findById(resItem.id);
        })
        .then(function(item) {

          resItem.id.should.equal(item.id);
          resItem.number.should.equal(item.number);
          resItem.customer.should.equal(item.customer);
          resItem.item.should.equal(item.item);
          resItem.price.should.equal(item.price);
          resItem.userId.should.equal(item.userId+'');
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new item', function() {
      const newItem = generateTestItem();

      return chai.request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${test_token}`)
        .send(newItem)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'number', 'customer', 'item', 'price', 'userId');
          res.body.number.should.equal(newItem.number);
          res.body.id.should.not.be.null;
          res.body.customer.should.equal(newItem.customer);
          res.body.price.should.equal(parseFloat(newItem.price));
          res.body.item.should.equal(newItem.item);
          res.body.userId.should.equal(newItem.userId);         
          return Item.findById(res.body.id);
        })
        .then(function(item) {
          item.number.should.equal(newItem.number);
          item.customer.should.equal(newItem.customer);
          item.price.should.equal(parseFloat(newItem.price));
          item.item.should.equal(newItem.item);
          (item.userId + '').should.equal(newItem.userId +'');
        });
    });
  });

  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        customer: 'La La',
        item: 'Ma ma',
        price: 99.99
      };

      return Item
        .findOne()
        .then(function(item) {
          updateData.id = item.id;
          return chai.request(app)
            .put(`/api/items/${item.id}`)
            .set('Authorization', `Bearer ${test_token}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(200);

          return Item.findById(updateData.id);
        })
        .then(function(item) {
          item.customer.should.equal(updateData.customer);
          item.item.should.equal(updateData.item);
          item.price.should.equal(updateData.price);
        });
      });
  });

  describe('DELETE endpoint', function() {
    it('delete a item by id', function() {

      let item;

      return Item
        .findOne()
        .then(function(_item) {
          item = _item;
          return chai.request(app).delete(`/api/items/${item.id}`).set('Authorization', `Bearer ${test_token}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Item.findById(item.id);
        })
        .then(function(_item) {
          should.not.exist(_item);
        });
    });
  });
});
