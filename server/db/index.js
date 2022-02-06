//this file defines the db connection - uses information stores in environment variables

const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
    query: (text, params) => pool.query(text, params)
}