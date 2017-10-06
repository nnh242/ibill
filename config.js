exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL ||
'mongodb://localhost/ibill-app';
exports.PORT = process.env.PORT || 27017;
//local host waits for connection on port 27017
// config tested okay, connected to server 
