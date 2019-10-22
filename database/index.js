require('dotenv').config({path: '../.env'})
const pgp = require('pg-promise')(/* options */);
const db = pgp(process.env.DB_URL)
module.exports = db;