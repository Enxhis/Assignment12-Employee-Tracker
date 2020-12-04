const util = require("util");
const mysql = require("mysql");

// create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "myloveReni2015",
    database: "employees_db"
});

connection.connect();
connection.query = util.promisify(connection.query);

module.exports = connection;