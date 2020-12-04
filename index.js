const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
// require db
const db = require("./db");
// require console.table to better present the data in a tabular way
require("console.table");

// display logo prompt function
function logoDisplay() {
    const logoTxt = logo({ name: "Employee Manager" }).render();
    console.log(logoTxt);
}

// call logoDisplay
logoDisplay();


// display prompts
function displayMainPrompts() {
    // array of options to choose for the user
    const { userInput } = await prompt([
        {
            type: "list",
            name: "userInput",
            message: "What would you like to do from the menu: ",
            options: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]);

    // switch case depending on the userInput
    switch (userInput) {
        case "VIEW_EMPLOYEES":
            return viewEmployees();
        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            return viewEmployeesByDepartment();
        case "VIEW_EMPLOYEES_BY_MANAGER":
            return viewEmployeesByManager();
        case "ADD_EMPLOYEE":
            return addEmployee();
        case "REMOVE_EMPLOYEE":
            return removeEmployee();
        case "UPDATE_EMPLOYEE_ROLE":
            return updateEmployeeRole();
        case "UPDATE_EMPLOYEE_MANAGER":
            return updateEmployeeManager();
        case "VIEW_DEPARTMENTS":
            return viewDepartments();
        case "ADD_DEPARTMENT":
            return addDepartment();
        case "REMOVE_DEPARTMENT":
            return removeDepartment();
        case "VIEW_ROLES":
            return viewRoles();
        case "ADD_ROLE":
            return addRole();
        case "REMOVE_ROLE":
            return removeRole();
        default:
            return quit();
    }
}
// Function displays all employees
function viewEmployees() {
    // call the findEmployees function from db
    const employees = db.findEmployees();
    console.log("\n");
    // to pretty print the data in a tabular way
    console.table(employees);
    // function call to display menu again
    displayMainPrompts()
}

// Function displays employees by department
function viewEmployeesByDepartment() {
    const departments = db.findDepartments();

    // choose department
    const chooseDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    // user prompt choice
    const { departmentId } = prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department's employees would you like to see? ",
            choices: chooseDepartment
        }
    ]);

    // pass the departmentId to the findEmployeesByDepartment function
    const employees = db.findEmployeesByDepartment(departmentId);

    console.log("\n");
    // display data in tabular way
    console.table(employees);

    // function call to display menu again
    displayMainPrompts()
}

// Function displays employees by manager
function viewEmployeesByManager() {
    const managers = db.findEmployees();

    // choose manager 
    const chooseManager = managers.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    // user prompt choices
    const { managerId } = prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee's report would you like to see?",
            choices: chooseManager
        }
    ]);

    // pass the nanagerId to the function findEmployeesByManager
    const employees = db.findEmployeesByManager(managerId);
    console.log("\n");

    // check if the selected Id is not manager and has no reports to show
    if (employees.length === 0) {
        console.log("The employee selected has no reports!");
    } else {
        console.table(employees);
    }
    // function call to display menu again
    displayMainPrompts()
}

// Function adds new employee in database
function addEmployee() {
    const roles = db.findRoles();
    const employees = db.findEmployees();

    // get input from user for the new employee (firstname, lastname)
    const newEmployee = prompt([
        {
            name: "firstname",
            message: "What is employee's firstname? "
        },
        {
            name: "lastname",
            message: "What is employee's lastname? "
        }
    ]);

    // add the role that new employee has
    const chooseRole = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    // get role title from prompt
    const { roleId } = prompt({
        type: "list",
        name: "roleId",
        message: "What is new Employee's role?",
        choices: chooseRole
    });

    // assign roleId taken from the prompt to the employee.role_id
    newEmployee.role_id = roleId;

    // assign manager to the new employee
    const chooseManager = employees.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    chooseManager.unshift({ name: "None", value: null });

    // get manager from prompt
    const { managerId } = prompt({
        type: "list",
        name: "managerId",
        message: "Who is the manager of the new employee? ",
        choices: chooseManager
    });

    // assign managerId to the employee
    newEmployee.manager_id = managerId;

    //call the createNewEmployee
    db.createNewEmployee(newEmployee);
    // TEST IT
    //notify for the new Employee added
    console.log(`${newEmployee.firstname} ${newEmployee.lastname} is added to the database`);

    // function call to display menu again
    displayMainPrompts()
}

// Function deletes employee from database
function removeEmployee() {
    // function call to display menu again
    displayMainPrompts()
}

// Function updates data for current employee role
function updateEmployeeRole() {
    // function call to display menu again
    displayMainPrompts()
}

// Function updates data for manager employee
function updateEmployeeManager() {
    // function call to display menu again
    displayMainPrompts()
}

// Function displays departments
function viewDepartments() {
    // call findDepartments function from db
    const departments = db.findDepartments();
    console.log("\n");
    // present data in tabular way
    console.table(departments);
    // function call to display menu again
    displayMainPrompts()
}

// Function adds new department to database
function addDepartment() {
    // get department from prompt
    const department = prompt ({
        name: "name",
        message: "What is the dapartment's name?"
    });
    // pass department to the function arg
    db.createNewDepartment(department);
    //TEST IT
    // notify for the new Entry
    console.log(`${department.name} added to the database!`)
    // function call to display menu again
    displayMainPrompts()
}

// Function deletes a current department
function removeDepartment() {
    // function call to display menu again
    displayMainPrompts()
}

// Function displays roles
function viewRoles() {
    // call the viewRoles from db
    const roles = db.findRoles();
    console.log("\n");
    // present the data in tabular way
    console.table(roles);
    // function call to display menu again
    displayMainPrompts()
}

// Function adds a new role in database
function addRole() {
    const departments = db.findDepartments();

    // choose department
    const chooseDepartment =departments.map(({id, name}) => ({
        name: name,
        value: id
    }));

    // get role from the user 
    const newRole = prompt([
        {
            name: "title",
            message: "What is the role's name?"
        },
        {
            name: "salary",
            message: "What is the role's salary?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department is this role in?",
            choices: chooseDepartment
        }
    ]);
    db.createNewRole(newRole);
    //TEST IT
    // Notify for the new entry
    console.log(`${role.title} added to the database!`);
    // function call to display menu again
    displayMainPrompts()
}

// Function deletes a current role from database
function removeRole() {
    // function call to display menu again
    displayMainPrompts()
}

// Function quits the program
function quit() {
    console.log("Thank you for interacting with the terminal prompt! GoodBye!");
    process.exit();
}