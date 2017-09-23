const express = require('express');
const app = express();

app.use(express.static('public'));
//create

//retrieve
app.get('/', (req,res) => {
    res.sendFile(__dirname + 'index.html');
});
app.get('/login', (req,res) => {
    res.sendFile(__dirname + 'login.html')
});
app.get('/dashboard', (req,res) => {
    res.sendFile(__dirname + 'dashboard.html')
});
app.get('/preview', (req,res) => {
    res.sendFile(__dirname + 'preview.html')
} )

//update

//delete


app.listen(process.env.PORT || 8080);
exports.app = app;


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
    res.status(404).json({message: 'Not Found'});
  });

let server;

// this function connects to our database, then starts the server
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

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
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

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};