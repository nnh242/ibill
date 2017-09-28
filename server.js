
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req,res) => {
    console.log(__dirname);
    res.sendFile(__dirname + 'index.html');
});

app.get('/dashboard', (req,res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.get('/preview', (req,res) => {
  console.log(__dirname);
    res.sendFile(__dirname + '/public/preview.html')
});

app.listen(process.env.PORT || 3525);
exports.app = app;

