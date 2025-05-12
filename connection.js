const mysql = require('mysql2');

const connection = mysql.createConnection({
    host :'localhost',
    user : 'root',
    password : 'ayush@124',
    database : 'School_Management',
})


 module.exports = {connection}

