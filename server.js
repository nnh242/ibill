require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require ('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const {PORT, DATABASE_URL} = require('./config');
const bcrypt = require('bcryptjs');

const itemsRouter = require('./routers/itemsRouter');

const userRouter = require('./routers/userRouter');

const authRouter = require('./auth/authRouter');

const {basicStrategy, jwtStrategy }= require ('./auth/strategies');

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
      return res.send(204);
  }
  next();
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + 'index.html');
});
app.get('/login', (req,res) => {
  res.sendFile(__dirname + '/public/login.html');
});
app.get('/dashboard/:id', (req,res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});
/* app.get('/preview/:id', (req,res) => {
    res.sendFile(__dirname + '/public/preview.html')
}); */

app.use(passport.initialize());
passport.use('basic',basicStrategy);
passport.use('jwt', jwtStrategy);

app.use('/api/items', itemsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

app.listen(process.env.PORT || 3525);

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
      });
    });
  }
  
  function closeServer() {
    return mongoose.disconnect().then(() => {
       return new Promise((resolve, reject) => {
         console.log('Closing server');
         server.close(err => {
             if (err) {
                 return reject(err);
             }
             resolve();
         });
       });
    });
  }
  
  if (require.main === module) {
    runServer().catch(err => console.error(err));
  };
  
  module.exports = {app, runServer, closeServer};