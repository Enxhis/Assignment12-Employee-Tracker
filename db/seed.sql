USE employees_db;

-- populate department table with values
INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Sales'),
    ('Legal');

-- populate role table with values
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Lead Engineer', 160000, 1),
    ('Software Engineer', 140000, 1),
    ('Software developer Engineer', 150000, 1),
    ('Accountant Manager', 150000, 2),
    ('Accountant', 120000, 2),
    ('Project Accountant', 80000, 2),
    ('Sales Director', 100000, 3),
    ('Sales Manager', 85000, 3),
    ('Salesperson', 65000, 3),
    ('Legal Team Leader', 165000, 4),
    ('Employment Lawyer',135000, 4),
    ('Lawyer', 120000, 4);

-- populate employee table with values
INSERT INTO employee
    (firstname, lastname, role_id, manager_id)
VALUES
    ('Arielle', 'Hane', 1, NULL),
    ('Tianna', 'Kunze', 2, 1),
    ('Ella', 'Dickens', 3, 1),
    ('Jorge', 'Friesen', 4, Null),
    ('Katie', 'Schiller', 5, 4),
    ('Carrie', 'Hessel', 6, 4),
    ('Jarred', 'Weissnat', 7, NULL),
    ('Alexandra', 'Kozey', 8, 7),
    ('Daniel', 'Ortiz', 9, 7),
    ('Josh', 'Rowe', 10, NULL),
    ('Marvin', 'Douglas', 11, 10),
    ('Maddison', 'Herman', 12, 10);
