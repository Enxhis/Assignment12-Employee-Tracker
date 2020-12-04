// require connection.js
const connection = require("./connection");

// Create Class DataBase

class DataBase {
    // constructor of the class, takes connection as an argument
    constructor(connection){
        this.connection = connection;
    }

    // find all employees using joins
    findEmployees(){
        return this.connection.query(
            "SELECT employee.id, employee.firstname, employee.lastname, role.title,"+ 
            "department.name AS department, role.salary, " +
            "CONCAT(manager.firstname, ' ', manager.lastname) AS manager " +
            "FROM employee LEFT JOIN role ON employee.role_id = role.id "+
            "LEFT JOIN department ON role.department_id = department.id "+
            "LEFT JOIN employee manager ON manager.id = employee.manager_id;"
        );
    }
    
    // find all roles  using joins
    findRoles(){
        return this.connection.query(
            "SELECT role.id, role.title, department.name AS department, role.salary " +
            "FROM role LEFT JOIN department ON role.department_id = department_id;"
        );
    }

    // find all departments using joins
    findDepartments(){
        return this.connection.query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget "+
            "FROM employee LEFT JOIN role ON employee.role_id = role.id "+
            "LEFT JOIN department ON role.department_id = department.id "+
            "GROUP BY department.id, department.name;"
        );
    }

}

module.exports = new DataBase(connection);