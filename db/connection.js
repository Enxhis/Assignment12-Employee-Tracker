const util = require("util");
const mysql = require("mysql");

// create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees_db"
});

connection.connect();

module.exports = connection;