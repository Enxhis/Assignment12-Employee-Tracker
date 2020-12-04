// require connection.js
const connection = require("./connection");

// Create Class DataBase

class DataBase {
    // constructor of the class, takes connection as an argument
    constructor(connection) {
        this.connection = connection;
    }

    // find all employees using joins
    findEmployees() {
        return this.connection.query(
            "SELECT employee.id, employee.firstname, employee.lastname, role.title," +
            "department.name AS department, role.salary, " +
            "CONCAT(manager.firstname, ' ', manager.lastname) AS manager " +
            "FROM employee LEFT JOIN role ON employee.role_id = role.id " +
            "LEFT JOIN department ON role.department_id = department.id " +
            "LEFT JOIN employee manager ON manager.id = employee.manager_id;"
        );
    }

    // find manager employees by employeeID
    findEmployeesByManager(employeeId) {
        return this.connection.query(
            "SELECT id, firstname, lastname FROM employee WHERE id != ?", employeeId
        );
    }

    // find employees by departmend
    findEmployeesByDepartment(departmentId) {
        return this.connection.query(
            "SELECT employee.id, employee.firstname, employee.lastname, role.title " +
            "FROM employee LEFT JOIN role ON employee.role_id = role.id " +
            "LEFT JOIN department ON role.department_id = department.id " +
            "WHERE department.id = ?;", departmentId
        );
    }

    // find all roles  using joins
    findRoles() {
        return this.connection.query(
            "SELECT role.id, role.title, department.name AS department, role.salary " +
            "FROM role LEFT JOIN department ON role.department_id = department_id;"
        );
    }

    // find all departments using joins
    findDepartments() {
        return this.connection.query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget " +
            "FROM employee LEFT JOIN role ON employee.role_id = role.id " +
            "LEFT JOIN department ON role.department_id = department.id " +
            "GROUP BY department.id, department.name;"
        );
    }
    // create new employee
    createNewEmployee(employee) {
        return this.connection.query(
            "INSERT INTO employee SET ?", employee
        );
    }
    // create new department
    createNewDepartment(department) {
        return this.connection.query(
            "INSERT INTO department SET ?", department
        );
    }

    // create new role
    createNewRole(role) {
        return this.connection.query(
            "INSERT INTO role SET ?", role
        );
    }

    // Delete from database existing employee
    deleteEmployee(employeeId) {
        return this.connection.query(
            "DELETE FROM employee WHERE id =?", employeeId
        );
    }

    // Delete from database existing department
    deleteDepartment(departmentId) {
        return this.connection.query(
            "DELETE FROM department WHERE id = ?", departmentId
        );
    }

    // Delete from databse existing role
    deleteRole(roleId) {
        return this.connection.query(
            "DELETE FROM role WHERE id = ?", roleId
        );
    }
    //Update Role of the employee
    updateRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]
        );
    }


}

module.exports = new DataBase(connection);