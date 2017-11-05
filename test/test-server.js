const mocha = require ('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

//test that index.html is served at root endpoint
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
// test that login.html is served at /login endpoint
describe('login page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/login')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});
//test taht dashboard.html is served and customized by userId at /dashboard/:id
describe('dashboard page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/dashboard/:id')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});
