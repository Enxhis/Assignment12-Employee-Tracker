const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
// require console.table to better present the data in a tabular way
require("console.table");

// call logoDisplay
logoDisplay();

// display logo prompt function
function logoDisplay() {
    const logoTxt = logo({ name: "Employee Manager" }).render();
    console.log(logoTxt);
    displayMainPrompts();
}



// display prompts
async function displayMainPrompts() {
    // array of options to choose for the user
    const { userInput } = await inquirer.prompt([
        {
            type: "list",
            name: "userInput",
            message: "What would you like to do from the menu: ",
            choices: [
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
async function viewEmployees() {
    // call the findEmployees function from db
    const employees = await db.findEmployees();
    console.log("\n");
    // to pretty print the data in a tabular way
    console.table(employees);
    // function call to display menu again
    displayMainPrompts();
}

// Function displays employees by department
async function viewEmployeesByDepartment() {
    const departments = await db.findDepartments();

    // choose department
    const chooseDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    // user prompt choice
    const { departmentId } = await inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department's employees would you like to see? ",
            choices: chooseDepartment
        }
    ]);

    // pass the departmentId to the findEmployeesByDepartment function
    const employees = await db.findEmployeesByDepartment(departmentId);

    console.log("\n");
    // display data in tabular way
    console.table(employees);

    // function call to display menu again
    displayMainPrompts();
}

// Function displays employees by manager
async function viewEmployeesByManager() {
    const managers = await db.findEmployees();

    // choose manager 
    const chooseManager = managers.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    // user prompt choices
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee's report would you like to see?",
            choices: chooseManager
        }
    ]);

    // pass the nanagerId to the function findEmployeesByManager
    const employees = await db.findEmployeesByManager(managerId);
    console.log("\n");

    // check if the selected Id is not manager and has no reports to show
    if (employees.length === 0) {
        console.log("The employee selected has no reports!");
    } else {
        console.table(employees);
    }
    // function call to display menu again
    displayMainPrompts();
}

// Function adds new employee in database
async function addEmployee() {
    const roles = await db.findRoles();
    const employees = await db.findEmployees();

    // get input from user for the new employee (firstname, lastname)
    const newEmployee = await inquirer.prompt([
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
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "What is new Employee's role?",
            choices: chooseRole
        }
    ]);

    // assign roleId taken from the prompt to the employee.role_id
    newEmployee.role_id = roleId;

    // assign manager to the new employee
    const chooseManager = employees.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    chooseManager.unshift({ name: "None", value: null });

    // get manager from prompt
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Who is the manager of the new employee? ",
            choices: chooseManager
        }
    ]);

    // assign managerId to the employee
    newEmployee.manager_id = managerId;

    //call the createNewEmployee
    await db.createNewEmployee(newEmployee);
    // TEST IT
    //notify for the new Employee added
    console.log(`${newEmployee.firstname} ${newEmployee.lastname} is added to the database`);

    // function call to display menu again
    displayMainPrompts()
}

// Function deletes employee from database
async function removeEmployee() {
    const employees = await db.findEmployees();
    // choose employee
    const chooseEmployee = employees.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    // choose employee id to delete from database
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to remove?",
            choices: chooseEmployee
        }
    ]);

    // pass employeeId to the deleteEmployee function
    await db.deleteEmployee(employeeId);
    //TEST IT
    // Notify that employee was deleted from database
    console.log("Employee removed successfully!");
    // function call to display menu again
    displayMainPrompts()
}

// Function updates data for current employee role
async function updateEmployeeRole() {
    const employees = await db.findEmployees();
    // choose employee
    const chooseEmployee = employees.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    // choose employeeId who will get its role updated
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role would you like to update?",
            choices: chooseEmployee
        }
    ]);

    // get all roles
    const roles = await db.findRoles();
    // choose role
    const chooseRole = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    // choose roleId that the employee will get assigned with
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role will be assigned to the employee?",
            choices: chooseRole
        }
    ]);

    // pass roleId and employeeId to updateRole
    await db.updateRole(employeeId, roleId);
    //TEST IT
    // Notify that employee's role was updated
    console.log("Employee's role updated successfully!");

    // function call to display menu again
    displayMainPrompts();
}

// Function updates data for manager employee
async function updateEmployeeManager() {
    // get all employees
    const employees = await db.findEmployees();
    //choose employee
    const chooseEmployee = employees.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    // choose employee to be updated
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's manager would you like to update?",
            choices: chooseEmployee
        }
    ]);

    const managers = await db.findEmployeesByManager(employeeId);

    // choose manager
    const chooseManager = managers.map(({ id, firstname, lastname }) => ({
        name: `${firstname} ${lastname}`,
        value: id
    }));

    // choose managerId to be updated
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee would you like to set as manager?",
            choices: chooseManager
        }
    ]);

    // pass managerId and employeeID to the updateManager
    await db.updateManager(employeeId, managerId);
    // TEST IT
    // Notify that the manager was updated
    console.log("Employee's manager was updated successfully!");
    // function call to display menu again
    displayMainPrompts();
}

// Function displays departments
async function viewDepartments() {
    // call findDepartments function from db
    const departments = await db.findDepartments();
    console.log("\n");
    // present data in tabular way
    console.table(departments);
    // function call to display menu again
    displayMainPrompts()
}

// Function adds new department to database
async function addDepartment() {
    // get department from prompt
    const department = await inquirer.prompt([
        {
            name: "name",
            message: "What is the dapartment's name?"
        }
    ]);
    // pass department to the function arg
    await db.createNewDepartment(department);
    //TEST IT
    // notify for the new Entry
    console.log(`${department.name} added to the database!`);
    // function call to display menu again
    displayMainPrompts();
}

// Function deletes a current department
async function removeDepartment() {
    const departments = await db.findDepartments();

    // choose department
    const chooseDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    // choose departemnt id to delete
    const { departmentId } = await inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to remove, together with roles &n employees?",
            choices: chooseDepartment
        }
    ]);

    // pass departmentId to the deleteDepartment function
    await db.deleteDepartment(departmentId);
    //TEST IT
    // Notify that the department was deleted
    console.log("Department was deleted successfully!");
    // function call to display menu again
    displayMainPrompts();
}

// Function displays roles
async function viewRoles() {
    // call the viewRoles from db
    const roles = await db.findRoles();
    console.log("\n");
    // present the data in tabular way
    console.table(roles);
    // function call to display menu again
    displayMainPrompts();
}

// Function adds a new role in database
async function addRole() {
    const departments = await db.findDepartments();

    // choose department
    const chooseDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    // get role from the user 
    const newRole = await inquirer.prompt([
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

    await db.createNewRole(newRole);
    //TEST IT
    // Notify for the new entry
    console.log(`${newRole.title} added to the database!`);
    // function call to display menu again
    displayMainPrompts();
}

// Function deletes a current role from database
async function removeRole() {
    const roles = await db.findRoles();
    // choose role
    const chooseRole = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    // choose role that will be deleted
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role would you like to remove together with the employees working in that role?",
            choices: chooseRole
        }
    ]);

    // pass role id to the function deleteRole
    await db.deleteRole(roleId);
    //TEST IT
    // Notify that the role was removed
    console.log("Role was removed from database successfully!");
    // function call to display menu again
    displayMainPrompts();
}

// Function quits the program
function quit() {
    //console.log("Thank you for interacting with the terminal prompt! GoodBye!");
    const logoTxt = logo({ name: "GoodBye!" }).render();
    console.log(logoTxt);
    process.exit();
}