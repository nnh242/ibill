const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');


const createAuthToken = user => {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

const router = express.Router();
// this api/auth/login - user use username and password to log in
router.get('/login',
    passport.authenticate('basic', {session: false}),
    (req, res) => {
        const authToken = createAuthToken(req.user.apiRepr());
        res.json({authToken: authToken, user: req.user}); 
    }
);
//this endpoint is for when jwt expires and user exchange for a new one
router.post('/refresh',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const authToken = createAuthToken(req.user);
        res.json({authToken}); 
        console.log(req.user);
    }
);

module.exports = router;
