const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const should = chai.should();

const {User} = require('../models/users');
const {app, runServer, closeServer} = require('../server');
const{TEST_DATABASE_URL} = require('../config');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

describe('User API endpoints', function() {
    const username = 'testUser';
    const password = 'testPassword';
    const company = 'Test';
    const usernameB = 'testUserB';
    const passwordB = 'testPasswordB';
    const companyB = 'TestB';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    afterEach(function() {
        return User.remove({});
    });

    describe('/api/users', function() {
        describe('POST', function() {
            it('Should reject users with missing username', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({password, company})
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Missing field');
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should reject users with missing password', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({
                        username,
                        company
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Missing field');
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with non-string username', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({
                        username: 1234,
                        password,
                        company
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Incorrect field type: expected string'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            
            it('Should reject users with empty username', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({
                        username: '',
                        password,
                        company
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Must be at least 1 characters long'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should reject users with password less than ten characters', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({
                        username,
                        password: '123456789',
                        company
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Must be at least 10 characters long'
                        );
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with password greater than 72 characters', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({
                        username,
                        password: new Array(73).fill('a').join(''),
                        company
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Must be at most 72 characters long'
                        );
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with duplicate username', function() {
                return User.create({
                    username,
                    password,
                    company
                })
                    .then(() =>
                        chai.request(app).post('/api/users/register').send({
                            username,
                            password,
                            company
                        })
                    )
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Username already taken'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should create a new user', function() {
                return chai
                    .request(app)
                    .post('/api/users/register')
                    .send({
                        username,
                        password,
                        company
                    })
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.contain.keys('username','password','company','id');
                        expect(res.body.username).to.equal(username);
                        expect(res.body.company).to.equal(company);
                        return User.findOne({
                            username
                        });
                    })
                    .then(user => {
                        expect(user).to.not.be.null;
                        expect(user.company).to.equal(company);
                        return user.validatePassword(password);
                    })
                    .then(passwordIsCorrect => {
                        expect(passwordIsCorrect).to.be.true;
                    });
            });
        });
    });
});
