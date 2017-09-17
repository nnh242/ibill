const mocha = require ('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);


describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('login page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('dashboard page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/dashboard')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe ('preview invoice', function (){
  it('exists', function(done) {
    chai.request(app)
      .get('/preview')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});