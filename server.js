
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require ('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const invoicesRouter = require('./routers/invoicesRouter');
const userRouter = require('./routers/userRouter');
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.get('/', (req,res) => {
    res.sendFile(__dirname + 'index.html');
});
app.get('/login', (req,res) => {
  res.sendFile(__dirname + '/public/login.html');
});
app.get('/dashboard', (req,res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});
app.get('/preview', (req,res) => {
    res.sendFile(__dirname + '/public/preview.html')
});
app.use('/api/invoices', invoicesRouter);
app.use('/api/users', userRouter);

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

app.listen(process.env.PORT || 3525);

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
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