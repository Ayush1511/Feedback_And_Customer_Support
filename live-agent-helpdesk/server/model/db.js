const mysql = require('mysql2');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', //insert your db password here
    database: 'customer_suppport'
});

module.exports = pool;