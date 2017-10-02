
const express = require('express');
const app = express();
const morgan = require ('morgan');
const invoicesRouter = require('./routers/invoicesRouter');
const userRouter = require('./routers/userRouter');

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

app.listen(process.env.PORT || 3525);
exports.app = app;

