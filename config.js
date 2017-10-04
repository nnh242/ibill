exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL ||
'mongodb://localhost/ibill';
exports.PORT = process.env.PORT || 3525;
//how do i test that this block of code works